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
import SideBarComp from "./SideBarComp";
import AddTaskModel from "./AddTaskModel";

const KanbanBoard = () => {
  const [columns, setColumns] = useState({});
  const [projectTitle, setProjectTitle] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/1");
        setProjectTitle(res.data.projects[0].title);
        //for each column we wre giving id as object with key and data of tasks as a value. for individual ids we have saperate stage and items
        setColumns({
          [uuid()]: {
            name: "Requested",
            items: res.data.projects[0].tasks
              .filter((task) => task.stage === "Requested")
              .sort((a, b) => a.order - b.order),
          },
          [uuid()]: {
            name: "To do",
            items: res.data.projects[0].tasks
              .filter((task) => task.stage === "To do")
              .sort((a, b) => a.order - b.order),
          },
          [uuid()]: {
            name: "Doing",
            items: res.data.projects[0].tasks
              .filter((task) => task.stage === "Doing")
              .sort((a, b) => a.order - b.order),
          },
          [uuid()]: {
            name: "Done",
            items: res.data.projects[0].tasks
              .filter((task) => task.stage === "Done")
              .sort((a, b) => a.order - b.order),
          },
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const onDragEnd = (result, columns, setColumns) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      // Handling item moving to a different column
      // droppableId tells us which column an item belongs to, allowing us to access and update the correct item list within that column. The draggableId is only used to render each individual task and doesn’t influence the logic within onDragEnd.
      const sourceColumn = columns[source.droppableId];
      const destinationColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destinationItems = [...destinationColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: {
          ...destinationColumn,
          items: destinationItems,
        },
      });
    } else {
      // Handling item moving within the same column
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

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
          {/* Object.entries() is for Access to Keys and Values as a array  here columnId(from uuid) is key and column is data of indivi task*/}
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
              {/* Droppable is a container where draggable items can be dropped. */}
              <Droppable droppableId={columnId} key={columnId}>
                {/* provided contains properties and methods to hanlde drag and snapchat tells whether an item is being dragged over the column or not */}
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
                    {/* The .map function iterates through each item, rendering a Draggable component for each task */}
                    {column.items.map((item, index) => (
                      // Draggable allows each item to be moved around within or between columns.
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            mb="3"
                            p="3"
                            //condtional rendering for applying colors to tasks
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
      <AddTaskModel isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default KanbanBoard;
