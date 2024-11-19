const { Router } = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");

const projectRouter = Router();

// Helper function to handle errors
const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).send({ data: { error: true, message: "Server error" } });
};

// Get all projects for the logged-in user
projectRouter.get("/", async (req, res) => {
  try {
    const data = await Project.find(
      { user: req.user._id },
      { task: 0, __v: 0, updatedAt: 0 }
    );
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Get a single project by ID for the logged-in user
projectRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(422)
      .send({ data: { error: true, message: "Id is required" } });

  try {
    const data = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user._id,
    }).sort({ order: 1 });

    if (!data)
      return res
        .status(404)
        .send({ data: { error: true, message: "Project not found" } });

    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Create a new project for the logged-in user
projectRouter.post("/", async (req, res) => {
  const projectSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = projectSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const data = await new Project({ ...value, user: req.user._id }).save();
    res.send({
      data: {
        title: data.title,
        description: data.description,
        updatedAt: data.updatedAt,
        _id: data._id,
      },
    });
  } catch (e) {
    if (e.code === 11000) {
      return res
        .status(422)
        .send({ data: { error: true, message: "Title must be unique" } });
    } else {
      handleErrors(res, e);
    }
  }
});

// Update an existing project for the logged-in user
projectRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const projectSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = projectSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const data = await Project.updateOne(
      { _id: new mongoose.Types.ObjectId(id), user: req.user._id },
      { ...value },
      { upsert: true }
    );

    if (data.nModified === 0)
      return res
        .status(404)
        .send({ data: { error: true, message: "Project not found" } });

    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Delete a project for the logged-in user
projectRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Project.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user._id,
    });

    if (data.deletedCount === 0)
      return res
        .status(404)
        .send({ data: { error: true, message: "Project not found" } });

    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

projectRouter.post("/:id/task", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(500).send("Server error");

  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user._id,
    });

    if (!project)
      return res
        .status(404)
        .send({ error: true, message: "Project not found" });

    const taskCount = project.task.length;
    const taskIndex =
      taskCount > 0 ? Math.max(...project.task.map((o) => o.index)) + 1 : 0;

    const newTask = {
      ...value,
      stage: "Requested",
      order: taskCount,
      index: taskIndex,
    };

    project.task.push(newTask);
    await project.save();

    res.send(newTask);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Get a specific task from a project
projectRouter.get("/:id/task/:taskId", async (req, res) => {
  const { id, taskId } = req.params;

  if (!id || !taskId) return res.status(500).send("Server error");

  try {
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user._id,
    });

    if (!project)
      return res
        .status(404)
        .send({ error: true, message: "Project not found" });

    const task = project.task.id(taskId);
    if (!task)
      return res.status(404).send({ error: true, message: "Task not found" });

    res.send(task);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Update a specific task in a project
projectRouter.put("/:id/task/:taskId", async (req, res) => {
  const { id, taskId } = req.params;

  if (!id || !taskId) return res.status(500).send("Server error");

  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user._id,
      task: { $elemMatch: { _id: new mongoose.Types.ObjectId(taskId) } },
    });

    if (!project)
      return res.status(404).send({ error: true, message: "Task not found" });

    await Project.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        user: req.user._id,
        "task._id": new mongoose.Types.ObjectId(taskId),
      },
      {
        $set: {
          "task.$.title": value.title,
          "task.$.description": value.description,
        },
      }
    );

    res.send({ success: true, message: "Task updated successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Delete a task from a project (only for the logged-in user)
projectRouter.delete("/:id/task/:taskId", async (req, res) => {
  const { id, taskId } = req.params;

  if (!id || !taskId) return res.status(500).send("Server error");

  try {
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(id),
      user: req.user._id,
    });

    if (!project)
      return res
        .status(404)
        .send({ error: true, message: "Project not found" });

    const taskIndex = project.task.findIndex((task) => task.id === taskId);

    if (taskIndex === -1)
      return res.status(404).send({ error: true, message: "Task not found" });

    project.task.splice(taskIndex, 1);
    await project.save();

    res.send({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
});

// Update todos (rearrange and stage tasks) for the logged-in user
projectRouter.put(" /:id/todo", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(500).send("Server error");

  const todo = [];

  for (const key in req.body) {
    for (const index in req.body[key].items) {
      req.body[key].items[index].stage = req.body[key].name;
      todo.push({
        name: req.body[key].items[index]._id,
        stage: req.body[key].items[index].stage,
        order: index,
      });
    }
  }

  try {
    const project = await Project.findOne({
      _id: mongoose.Types.ObjectId(id),
      user: req.user._id,
    });

    if (!project)
      return res
        .status(404)
        .send({ error: true, message: "Project not found" });

    for (const item of todo) {
      await Project.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
          "task._id": mongoose.Types.ObjectId(item.name),
        },
        { $set: { "task.$.order": item.order, "task.$.stage": item.stage } }
      );
    }

    res.send({ success: true, message: "Todos updated successfully" });
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = projectRouter;
