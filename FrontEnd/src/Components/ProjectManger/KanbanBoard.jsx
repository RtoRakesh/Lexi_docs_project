import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid"; //for generating unique id's for columns
import { BsThreeDots } from "react-icons/bs";
import AddTaskModel from "./AddTaskModel";
import { useAuth } from "../../Context/AuthContextProvider";
const token = localStorage.getItem("token");

const KanbanBoard = ({ projectId }) => {
  const [columns, setColumns] = useState({});
  const [projectTitle, setProjectTitle] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://lexi-docs-project.onrender.com/projects/${projectId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        console.log(res.data);

        setProjectTitle(res.data.title);

        setColumns({
          [uuid()]: {
            name: "Requested",
            items: res.data.tasks
              .filter((task) => task.stage === "Requested")
              .sort((a, b) => a.order - b.order),
          },
          [uuid()]: {
            name: "To do",
            items: res.data.tasks
              .filter((task) => task.stage === "To do")
              .sort((a, b) => a.order - b.order),
          },
          [uuid()]: {
            name: "Doing",
            items: res.data.tasks
              .filter((task) => task.stage === "Doing")
              .sort((a, b) => a.order - b.order),
          },
          [uuid()]: {
            name: "Done",
            items: res.data.tasks
              .filter((task) => task.stage === "Done")
              .sort((a, b) => a.order - b.order),
          },
        });
      } catch (err) {
        console.error(
          "Error fetching project data:",
          err.response?.data || err
        );
      }
    };

    fetchData();
  }, [projectId, token]);

  const onDragEnd = async (result, columns, setColumns) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [movedItem] = sourceItems.splice(source.index, 1);

      movedItem.stage = destinationColumn.name; // Update task stage
      destinationItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      });

      // Update task in the backend
      try {
        await axios.patch(
          `https://lexi-docs-project.onrender.com/projects/${projectId}/tasks/${movedItem.id}`,
          { stage: destinationColumn.name },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
      } catch (err) {
        console.error("Error updating task stage:", err.response?.data || err);
      }
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [movedItem] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: { ...column, items: copiedItems },
      });
    }
  };

  return (
    <Box p="4" bg="gray.50" minH="100vh" flex="1">
      <Flex justify="space-between" align="center" mb="6">
        <Heading color="teal.700">
          <Text as="span">{projectTitle?.slice(0, 25)}</Text>
          {projectTitle?.length > 25 && "..."}
        </Heading>
        <Button
          onClick={onOpen}
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
        >
          Add Task
        </Button>
      </Flex>

      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        <Flex gap="4" overflowX="auto">
          {Object.entries(columns).map(([columnId, column]) => (
            <Box
              key={columnId}
              w="100%"
              bg="white"
              p="4"
              rounded="lg"
              shadow="lg"
              borderTop="4px solid"
              borderColor="teal.500"
            >
              <Flex justify="space-between" mb="4">
                <Flex align="center" gap="2">
                  <Text fontSize="md" fontWeight="bold" color="teal.600">
                    {column.name}
                  </Text>
                  <Tag
                    size="sm"
                    bg="teal.200"
                    color="teal.800"
                    visibility={column.items.length ? "visible" : "hidden"}
                  >
                    {column.items.length}
                  </Tag>
                </Flex>
                <Icon as={BsThreeDots} color="gray.500" />
              </Flex>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    minH="530px"
                    p="2"
                    transition="background-color 0.2s ease"
                    bg={snapshot.isDraggingOver ? "teal.100" : "gray.50"}
                    rounded="md"
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            mb="3"
                            p="3"
                            bg={
                              column.name === "Requested"
                                ? "orange.100"
                                : column.name === "To do"
                                ? "yellow.100"
                                : column.name === "Done"
                                ? "green.100"
                                : "blue.50"
                            }
                            rounded="md"
                            shadow={snapshot.isDragging ? "xl" : "sm"}
                            border="1px solid"
                            borderColor={
                              column.name === "Requested"
                                ? "orange.300"
                                : column.name === "To do"
                                ? "yellow.300"
                                : column.name === "Done"
                                ? "green.300"
                                : "blue.200"
                            }
                          >
                            <VStack align="start" spacing="2">
                              <Text fontWeight="medium" color="gray.800">
                                {item.title.slice(0, 22)}
                                {item.title.length > 22 && "..."}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {item.description.slice(0, 60)}
                                {item.description.length > 60 && "..."}
                              </Text>
                              <Tag
                                size="sm"
                                colorScheme={
                                  column.name === "Requested"
                                    ? "orange"
                                    : column.name === "To do"
                                    ? "yellow"
                                    : column.name === "Done"
                                    ? "green"
                                    : "blue"
                                }
                              >
                                Task-{index + 1}
                              </Tag>
                            </VStack>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Flex>
      </DragDropContext>
      <AddTaskModel isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </Box>
  );
};

export default KanbanBoard;
