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
    <Box bg="#F5F5F5" p={4} borderRadius="md" boxShadow="md" w="22vw">
      <Button
        colorScheme="blue"
        variant="solid"
        onClick={onCreate}
        mb={4}
        w="100%"
      >
        Create New Document
      </Button>
      <VStack align="start" spacing={3}>
        {documents?.map((doc) => (
          <HStack
            key={doc.id}
            p={2}
            w="100%"
            _hover={{ bg: "#E0E0E0", borderRadius: "md" }}
            borderBottom="1px solid #E0E0E0"
          >
            <Icon as={MdDescription} color="blue.500" />
            <Text
              flex="1"
              fontWeight="500"
              color="gray.700"
              cursor="pointer"
              onClick={() => onSelect(doc)}
            >
              {doc.title}
            </Text>
            <Menu>
              <MenuButton>
                <Icon as={BiDotsVerticalRounded} color="gray.600" />
              </MenuButton>
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
  );
};

export default SideBar;
