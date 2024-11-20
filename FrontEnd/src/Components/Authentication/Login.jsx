import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../../Context/AuthContextProvider";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const toast = useToast();

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      await login(email, password);

      toast({
        title: "Login successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Login failed.",
        description:
          err.response?.data?.message || err.message || "An error occurred.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
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
            md: "40vw",
            lg: "35vw",
            xl: "25vw",
          }}
          height="auto"
          p={{ base: "4", md: "6" }}
        >
          <Heading pb="4">Login</Heading>

          <FormControl as="form" isRequired onSubmit={handleSubmit}>
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
            <Text pt="6">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{ color: "teal", fontWeight: "bold" }}
              >
                Signup here
              </Link>
            </Text>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default Login;
