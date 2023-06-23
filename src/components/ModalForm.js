import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { setTransactions } from "../redux/reducers/transactions";
import { setWallet } from "../redux/reducers/wallet";

function ModalForm({ isOpen, onClose, registerToEdit, setRegisterToEdit }) {
  const { user } = useSelector((state) => state.user);
  const { wallet } = useSelector((state) => state.wallet);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: registerToEdit
      ? {
          name: registerToEdit.name,
          amount: registerToEdit.amount,
          type: registerToEdit.type,
          category: registerToEdit.category,
          date: registerToEdit.date,
        }
      : {
          name: "",
          amount: "",
          type: "",
          category: "",
          date: "",
        },
  });

  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const body = {
        ...data,
        userId: user.id,
      };
      let res;
      if (registerToEdit) {
        res = await axios.put(`/api/transactions/${registerToEdit.id}`, body);
        setValue("name", res.data.transactionUpdated.name);
        setValue("amount", res.data.transactionUpdated.amount);
        setValue("type", res.data.transactionUpdated.type);
        setValue("date", res.data.transactionUpdated.date);
      } else {
        console.log(body);
        res = await axios.post("/api/transactions", body);
        reset();
      }
      toast({
        title: res.data.msg,
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      const response = await axios.get(`/api/transactions/${wallet.id}`);
      dispatch(setTransactions(response.data));
      axios
        .get(`/api/wallet/${user.wallet.id}`)
        .then((res) => dispatch(setWallet(res.data)))
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
      if (error.response.data.errors) {
        console.log(error.response.data.errors);
      }
    }
  };

  const handleClose = () => {
    if (setRegisterToEdit) setRegisterToEdit(null);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          {registerToEdit ? "Editar registro" : "Agregar registro"}
        </ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody pb={6}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Nombre"
              {...register("name", {
                required: {
                  value: true,
                  message: "El nombre es requerido",
                },
                pattern: {
                  value: /^[A-Za-z0-9]+[A-Za-z0-9\s]+[A-Za-z0-9]+$/,
                  message: "No debe haber espacio al inicio o al final",
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
            {!errors.name && (
              <FormHelperText>
                El nombre solo puede tener letras, números y espacios.
              </FormHelperText>
            )}
            {errors.name && (
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mt={4} isInvalid={errors.amount}>
            <FormLabel>Cantidad</FormLabel>
            <Input
              placeholder="Cantidad"
              {...register("amount", {
                required: {
                  value: true,
                  message: "La cantidad es requerida",
                },
                min: {
                  value: 1,
                  message: "Debe ser un valor númerico mayor a 0",
                },
                validate: (value) =>
                  !isNaN(value) || "En número ingresado no es válido",
              })}
            />
            {!errors.amount && (
              <FormHelperText>
                La cantidad debe ser un valor númerico mayor a 0.
              </FormHelperText>
            )}

            {errors.amount && (
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl mt={4} isInvalid={errors.type}>
            <FormLabel>Tipo</FormLabel>
            <Select
              placeholder="Tipo"
              {...register("type", {
                required: {
                  value: true,
                  message: "El tipo es requerido",
                },
              })}
              onChange={(e) => {
                setValue("type", e.target.value);
                if (registerToEdit) setValue("category", "");
              }}
            >
              <option value="egress">Egreso</option>
              <option value="ingress">Ingreso</option>
            </Select>
            {errors.type && (
              <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
            )}
          </FormControl>

          {watch("type") && (
            <FormControl mt={4} isInvalid={errors.category}>
              <FormLabel>Categoria</FormLabel>
              {watch("type") === "ingress" && (
                <Select
                  placeholder="Seleccione una categoria"
                  {...register("category", {
                    required: {
                      value: true,
                      message: "La categoria es requerida",
                    },
                  })}
                >
                  <option value="payment">Cobros</option>
                  <option value="transfer">Transferencias</option>
                </Select>
              )}

              {watch("type") === "egress" && (
                <Select
                  placeholder="Seleccione una categoria"
                  {...register("category", {
                    required: {
                      value: true,
                      message: "La categoria es requerida",
                    },
                  })}
                >
                  <option value="purchase">Compras</option>
                  <option value="services">Pago servicios</option>
                </Select>
              )}
              {errors.category && (
                <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
              )}
            </FormControl>
          )}

          <FormControl mt={4} isInvalid={errors.date}>
            <FormLabel>Fecha</FormLabel>
            <Input
              type="date"
              placeholder="Fecha"
              {...register("date", {
                required: {
                  value: true,
                  message: "La fecha es requerida",
                },
              })}
            />
            {errors.date && (
              <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button type="submit" colorScheme="blue" mr={3}>
            {registerToEdit ? "Actualizar registro" : "Agregar registro"}
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalForm;
