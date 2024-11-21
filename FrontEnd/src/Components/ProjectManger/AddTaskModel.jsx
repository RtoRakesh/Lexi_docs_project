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
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContextProvider";
const token = localStorage.getItem("token");

const AddTaskModel = ({ projectId, isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newTask = {
        title,
        description: desc,
      };

      const res = await axios.post(
        `https://lexi-docs-project.onrender.com/projects/${projectId}/tasks`,
        newTask,
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token, // Use token for user authentication
          },
        }
      );

      console.log("Task added successfully:", res.data);
      setTitle("");
      setDesc("");
      onClose(); // Close modal after successful task addition
    } catch (err) {
      console.error("Error adding task:", err.response?.data || err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a New Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl as="form" isRequired onSubmit={handleSubmit}>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Add the Task Title"
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
  );
};

export default AddTaskModel;
