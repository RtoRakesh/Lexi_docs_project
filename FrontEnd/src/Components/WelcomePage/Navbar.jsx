import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Image,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import logo from "../../assets/simple logo for lexi.png";
import { ArrowForwardIcon } from "@chakra-ui/icons";

const Navbar = () => {
  return (
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
          <Image boxSize={{ lg: "50px", base: "35px" }} src={logo} alt="Logo" />
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
  );
};

export default Navbar;
