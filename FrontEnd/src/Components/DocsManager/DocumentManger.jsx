import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import axios from "axios";
import { useAuth } from "../../Context/AuthContextProvider";
import TextEditor from "./TextEditor";
const url = "http://localhost:3000/users";

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [newDocumentTitle, setNewDocumentTitle] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const fetchDocuments = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${user.id}`);
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      toast({
        title: "Error fetching documents",
        description: "There was an error loading your documents.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleEditDocument = (doc) => {
    setCurrentDocument(doc);
    setPreviewDocument(null);
  };

  const handleCreate = async () => {
    const newDoc = { id: Date.now(), title: newDocumentTitle, content: "" };
    const updatedDocuments = [...documents, newDoc];

    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        documents: updatedDocuments,
      });
      setDocuments(updatedDocuments);
      toast({
        title: "Document created.",
        description: "Your document has been successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewDocumentTitle("");
      onClose();
    } catch (err) {
      console.error("Failed to create document", err);
      toast({
        title: "Error creating document",
        description: "There was an error creating the document.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveContent = async (content) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === currentDocument.id ? { ...doc, content: content } : doc
    );
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        documents: updatedDocuments,
      });
      setDocuments(updatedDocuments);
      setCurrentDocument((prevDoc) => ({ ...prevDoc, content }));
      toast({
        title: "Document updated.",
        description: "Your document content has been successfully saved.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to update document", err);
      toast({
        title: "Error updating document",
        description: "There was an error updating the document.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePreviewDocument = (doc) => {
    setPreviewDocument(doc);
    setCurrentDocument(null);
  };

  const handleDeleteDocument = (id) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    const filteredDocuments = documents.filter((doc) => doc.id !== deleteId);
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        documents: filteredDocuments,
      });
      setDocuments(filteredDocuments);
      setIsDeleteOpen(false);
      toast({
        title: "Document Deleted",
        description: "Your document has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to delete document", err);
      toast({
        title: "Error deleting document",
        description: "There was an error deleting the document.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} p={4} gap={4}>
      <Box flex="1">
        <SideBar
          documents={documents}
          onCreate={onOpen}
          onSelect={handleEditDocument}
          onPreview={handlePreviewDocument}
          onDelete={handleDeleteDocument}
        />
      </Box>
      <Box
        flex="3"
        p={4}
        bg="white"
        borderRadius="md"
        boxShadow="lg"
        minH="80vh"
      >
        {currentDocument ? (
          <Box>
            <Heading size="md" mb={4} color="#3498DB">
              {currentDocument.title}
            </Heading>
            <TextEditor
              initialContent={currentDocument.content}
              onSave={handleSaveContent}
            />
          </Box>
        ) : previewDocument ? (
          <Box>
            <Heading size="md" mb={4} color="#3498DB">
              {previewDocument.title}
            </Heading>
            <Box
              p={4}
              bg="gray.50"
              borderRadius="md"
              boxShadow="md"
              dangerouslySetInnerHTML={{ __html: previewDocument.content }}
            />
          </Box>
        ) : (
          <Text fontSize="lg" color="gray.500">
            Select a document to start editing or preview
          </Text>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Document</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter document title"
              value={newDocumentTitle}
              onChange={(e) => setNewDocumentTitle(e.target.value)}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreate} ml={3}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Document
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default DocumentManager;
