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
const token = localStorage.getItem("token");

const SideBarComp = () => {
  const [projects, setProjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Function to fetch projects from the new backend route
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "https://lexi-docs-project.onrender.com/projects",
        {
          headers: { "x-auth-token": token },
        }
      ); // Updated endpoint
      console.log(res.data);

      setProjects(res.data); // Assuming the API returns an array of projects
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Load project data on component mount and setup event listener for updates
  useEffect(() => {
    fetchProjects();
    document.addEventListener("projectUpdate", fetchProjects);
    return () => document.removeEventListener("projectUpdate", fetchProjects);
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
          {projects.map((project) => (
            <ListItem key={project.id}>
              <Box
                as={Link}
                to={`/project/${project._id}`}
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
