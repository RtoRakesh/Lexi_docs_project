import React, { useState } from "react";
import Navbar from "../WelcomePage/Navbar";
import Footer from "../WelcomePage/Footer";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const handleSubmit = async () => {
    try {
      const info = {
        id: Date.now(),
        Username: username,
        Email: email,
        Password: password,
      };
      const res = await axios.post("http://localhost:3000/users", info);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        pt={{ base: "4", md: "8" }}
      >
        <Box
          maxW="md"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          width={{
            base: "80vw",
            sm: "60vw",
            md: "50vw",
            lg: "38vw",
            xl: "28vw",
          }}
          height="auto"
          p={{ base: "4", md: "6" }}
        >
          <Heading pb="4">Register</Heading>

          <FormControl as="form" isRequired onSubmit={handleSubmit}>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter Username"
              mb="4"
              onChange={(e) => setUsername(e.target.value)}
            />

            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter the Email"
              mb="4"
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormLabel>Password</FormLabel>
            <InputGroup mb="4">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button
              type="submit"
              colorScheme="teal"
              variant="solid"
              width="100%"
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Register;
