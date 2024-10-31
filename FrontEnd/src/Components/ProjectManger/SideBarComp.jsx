import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  List,
  ListItem,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import AddProjectModel from "./AddProjectModel";

const SideBarComp = () => {
  const [projects, setProjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to fetch project data
  const projectData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users/1");
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  // Load project data on component mount and setup event listener for updates
  useEffect(() => {
    projectData();
    document.addEventListener("projectUpdate", projectData);
    return () => document.removeEventListener("projectUpdate", projectData);
  }, []);

  return (
    <Box
      minH="100vh"
      bg="gray.600"
      color="white"
      p="4"
      borderRight="1px solid"
      borderColor="gray.700"
      position="relative"
    >
      {/* Header and Add Project Button */}
      <VStack spacing="5" align="stretch" mt="2">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.200">
            Projects
          </Text>
          <Button
            onClick={onOpen}
            size="sm"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            borderRadius="full"
          >
            +
          </Button>
        </Box>

        {/* Project List */}
        <List spacing="2">
          {projects.map((project, index) => (
            <ListItem key={index}>
              <Box
                as={Link}
                to={`/project/${project.id}`}
                px="4"
                py="2"
                bg="gray.700"
                _hover={{ bg: "blue.600", color: "white" }}
                transition="background-color 0.2s ease"
              >
                {project.title}
              </Box>
            </ListItem>
          ))}
        </List>
      </VStack>

      {/* AddProjectModel Component */}
      <AddProjectModel isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default SideBarComp;
