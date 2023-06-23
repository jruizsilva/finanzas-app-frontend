import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Text,
  Link,
  FormErrorMessage,
  InputRightElement,
  InputGroup,
  FormHelperText,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/reducers/user";
import Swal from "sweetalert2";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.data) {
        dispatch(setToken(res.data));
        sessionStorage.setItem("token", res.data.token);
        Swal.fire(
          "Credenciales válidas.",
          "Has iniciado sesión correctamente",
          "success"
        );
        reset();
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.msg) {
        toast({
          title: "Credenciales invalidas.",
          description: error.response.data.msg,
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} w={["100%", "md", "lg"]} py={[6, 12]} px={[3, 6]}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Iniciar sesión</Heading>
        </Stack>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          w="100%"
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "El email es requerido",
                  },
                  pattern: {
                    value:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: "Ingresa un email válido",
                  },
                  maxLength: {
                    value: 255,
                    message: "Debe tener menos de 255 caracteres",
                  },
                })}
              />
              {errors.email && (
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="password" isInvalid={errors.password}>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="on"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "El password es requerido",
                    },
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener mínimo 6 caracteres.",
                    },
                  })}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!errors.password && (
                <FormHelperText>
                  La contraseña debe tener mínimo 6 caracteres.
                </FormHelperText>
              )}
              {errors.password && (
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              )}
            </FormControl>
            <Stack spacing={10}></Stack>
            <Button
              type="submit"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Iniciar sesión
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={"center"}>
              ¿Aun no tienes una cuenta?{" "}
              <Link as={NavLink} to="/register" color={"blue.400"}>
                Registrate
              </Link>
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
