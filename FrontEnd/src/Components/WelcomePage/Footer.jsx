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
import "../../app.css";

const Footer = () => {
  return (
    <footer id="navBar">
      <Flex
        minWidth="max-content"
        alignItems="center"
        gap="2"
        flexDirection={{ base: "column", md: "row" }}
        backgroundColor="gray.100"
        height="8vh"
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
  );
};

export default Footer;
