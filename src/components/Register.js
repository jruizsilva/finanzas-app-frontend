import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ first_name: "", last_name: "", email: "", password: "" });
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/users", data);
      Swal.fire(res.data.msg, "Ya podes iniciar sesión", "success");
      navigate("/login");
      reset();
    } catch (error) {
      console.log(error);
      if (error.response.data.errors[0].msg) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.errors[0].msg,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al crear la cuenta",
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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Crea una cuenta
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
            <HStack>
              <Box>
                <FormControl id="first_name" isInvalid={errors.first_name}>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    type="text"
                    {...register("first_name", {
                      required: {
                        value: true,
                        message: "El nombre es requerido",
                      },
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message:
                          "El nombre solo puede tener letras y no contener espacios al inicio o al final.",
                      },
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres",
                      },
                      maxLength: {
                        value: 255,
                        message: "Debe tener menos de 255 caracteres",
                      },
                    })}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="last_name" isInvalid={errors.last_name}>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    type="text"
                    {...register("last_name", {
                      required: {
                        value: true,
                        message: "El apellido es requerido",
                      },
                      pattern: {
                        value: /^[a-zA-Z]+$/,
                        message:
                          "El nombre solo puede tener letras y no contener espacios al inicio o al final.",
                      },
                      minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres",
                      },
                      maxLength: {
                        value: 255,
                        message: "Debe tener menos de 255 caracteres",
                      },
                    })}
                  />
                </FormControl>
              </Box>
            </HStack>
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
            <Stack spacing={10} pt={2}>
              <Button
                type="submit"
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Crear cuenta
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                ¿Ya tienes una cuenta?{" "}
                <Link as={NavLink} to="/login" color={"blue.400"}>
                  Inicia sesión
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
