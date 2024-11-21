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

if (!token) {
  console.error("No token found. Please login again.");
}

const AddProjectModel = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newProject = {
        title,
        description: desc,
      };

      const res = await axios.post(
        `https://lexi-docs-project.onrender.com/projects`,
        newProject,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      console.log("Project created successfully:", res.data);
      setTitle("");
      setDesc("");
      onClose(); // Close the modal after submission
    } catch (err) {
      console.error("Error creating project:", err.response?.data || err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a New Project</ModalHeader>
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
  );
};

export default AddProjectModel;
