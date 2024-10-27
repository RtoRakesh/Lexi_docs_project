import React from "react";
import docManage2 from "../../assets/image1.png";
import { ArrowForwardIcon } from "@chakra-ui/icons";
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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContextProvider";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/documents");
    }
  };
  return (
    <>
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
          <Button
            leftIcon={<ArrowForwardIcon />}
            bg="white"
            border="1px solid"
            onClick={handleClick}
          >
            Enter LaxiDocs
          </Button>

          <Image
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              height: "auto",
            }}
            boxSize={{ base: "50vw", md: "30vw" }}
            src={docManage2}
            alt="doc"
          />
        </Box>
      </main>
    </>
  );
};

export default WelcomePage;
