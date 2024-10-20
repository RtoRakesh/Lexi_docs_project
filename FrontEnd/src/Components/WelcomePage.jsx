import React from "react";
import logo from "../assets/simple logo for lexi.png";
import docManage2 from "../assets/image1.png";
import { ArrowForwardIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Image,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const WelcomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <nav>
        <Flex
          minWidth="max-content"
          alignItems="center"
          gap="2"
          backgroundColor="black"
          p="4"
          direction={{ base: "column", md: "row" }}
        >
          <Flex p="2">
            <Image
              boxSize={{ lg: "50px", base: "35px" }}
              src={logo}
              alt="Logo"
            />
            <Heading size={{ lg: "xl", base: "lg" }} color="white" px="2">
              LexiDocs
            </Heading>
          </Flex>
          <Spacer />
          <ButtonGroup gap="2">
            <Button leftIcon={<ArrowForwardIcon />} bg="white">
              Enter LaxiDocs
            </Button>
          </ButtonGroup>
        </Flex>
      </nav>

      <main
        style={{
          textAlign: "center",
        }}
      >
        <Box pt="12">
          <Heading size="2xl">Your wiki, docs, & projects. Together.</Heading>
          <Text fontSize="lg" p="6">
            LaxiDocs is the connected workspace where better, faster work
            happens.
          </Text>
          <Button leftIcon={<ArrowForwardIcon />} bg="white" border="1px solid">
            Enter LaxiDocs
          </Button>

          {/* Make sure this image adjusts well to screen size */}
          <Image
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              height: "auto",
            }}
            boxSize={{ base: "50vw", md: "30vw" }} // Adjust image size for smaller screens
            src={docManage2}
            alt="doc"
          />
        </Box>
      </main>

      <footer>
        <Flex
          minWidth="max-content"
          alignItems="center"
          gap="2"
          flexDirection={{ base: "column", md: "row" }} // Stack vertically on mobile, row on desktop
          p="4" // Add padding for better spacing
          backgroundColor="gray.100" // Added background color for better footer visibility
        >
          <Flex>
            <Image boxSize="30px" src={logo} alt="Logo" />
            <Heading size="md" px="2">
              LexiDocs
            </Heading>
          </Flex>
          <Spacer />
          <ButtonGroup gap="2" flexDirection={{ base: "column", md: "row" }}>
            <Button>Privacy Policy</Button>
            <Button>Terms & Conditions</Button>
          </ButtonGroup>
        </Flex>
      </footer>
    </>
  );
};

export default WelcomePage;
