// AppLayout.js
import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import KanbanBoard from "./KanbanBoard";
import SideBarComp from "./SideBarComp";

const AppLayout = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }} minH="100vh">
      <Box width={{ base: "100%", md: "250px" }} flexShrink={0}>
        <SideBarComp />
      </Box>
      <Box flexGrow={1} p={{ base: "2", md: "4" }}>
        <KanbanBoard />
      </Box>
    </Flex>
  );
};

export default AppLayout;