import React from "react";
import {
  Box,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { ModalForm } from "./index";
import { useSelector } from "react-redux";

let pesosARG = Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  useGrouping: true,
});

function BalanceCard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { wallet } = useSelector((state) => state.wallet);

  return (
    <>
      <Box
        bg="white"
        w={["240px"]}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p="5"
      >
        <Stat mb={4}>
          <StatLabel fontSize={"lg"} color="blue.500">
            Balance
          </StatLabel>
          <StatNumber fontSize={"3xl"}>
            {pesosARG.format(wallet.balance)}
          </StatNumber>
          <StatHelpText>
            {new Date().toLocaleString("es-AR", { dateStyle: "short" })}
          </StatHelpText>
        </Stat>
        <Link color="blue.400" href="#" onClick={onOpen}>
          Agregar
        </Link>
      </Box>
      {isOpen && <ModalForm isOpen={isOpen} onClose={onClose} />}
    </>
  );
}

export default BalanceCard;
