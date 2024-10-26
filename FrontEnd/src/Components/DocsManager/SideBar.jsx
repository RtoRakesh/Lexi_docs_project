import {
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { MdDescription } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";

const SideBar = ({ documents, onCreate, onSelect, onPreview, onDelete }) => {
  return (
    <Box>
      <Button variant="solid" onClick={onCreate}>
        Create a new Document
      </Button>

      <Box>
        <VStack>
          {documents?.map((doc) => (
            <HStack>
              <Icon as={MdDescription} color="blue.500"></Icon>
              <Text>{doc.title}</Text>
              <Menu>
                <MenuButton as={BiDotsVerticalRounded}>Actions</MenuButton>
                <MenuList>
                  <MenuItem onClick={() => onPreview(doc)}>Preview</MenuItem>
                  <MenuItem onClick={() => onSelect(doc)}>Edit</MenuItem>
                  <MenuItem onClick={() => onDelete(doc.id)}>Delete</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default SideBar;
