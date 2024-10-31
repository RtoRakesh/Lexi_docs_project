import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContextProvider";

const AddTaskModel = ({ projectId = "2", isOpen, onClose }) => {
  const [projects, setProjects] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/1`);
        setProjects(res.data.projects);

        // setTitle(res.data.projects[0].title);
        // setDesc(res.data.projects[0].description);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);
  console.log(projects);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { id: Date.now(), title: title, description: desc };

    const updatedTasks = projects.map((project) =>
      project.id == projectId
        ? { ...project, tasks: [...project?.tasks, newTask] }
        : project
    );
    try {
      const resp = await axios.patch("http://localhost:3000/users/1", {
        projects: updatedTasks,
      });
      console.log(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl as="form" isRequired onSubmit={handleSubmit}>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                placeholder="Add the Project Title"
                mb="4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Description goes here"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <Button
                mt="2"
                type="submit"
                colorScheme="teal"
                variant="solid"
                width="100%"
              >
                Save
              </Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTaskModel;
