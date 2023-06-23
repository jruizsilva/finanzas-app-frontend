import React from "react";
import {
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Heading,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/user";

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("token");
  };

  return (
    <Flex
      px={[4, 8, 16]}
      height="10vh"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between" }}
      as="header"
    >
      <Heading as={"h1"} size="lg">
        Mis finanzas
      </Heading>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <VStack
                  display={{ base: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="md">{`${user.first_name} ${user.last_name}`}</Text>
                </VStack>
                <Box display={{ base: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem>Dashboard</MenuItem>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}

export default Header;
