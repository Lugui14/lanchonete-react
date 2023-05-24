import React, { useEffect, useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  ModalFooter,
  useToast,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWaiters } from "../../store/reducers/waiters";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const CreateControl = ({ onCreateControl, controlCreated }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const waiters = useSelector((state) => state.waiters);
  const [availableControls, setAvailableControls] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const findComponents = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    api
      .get(`waiter`)
      .then((res) => {
        dispatch(fetchWaiters({ payload: res.data }));
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: `Ocorreu um erro no envio recebimento da requisição: ${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

    api
      .get(`control/numbers`)
      .then((res) => {
        setAvailableControls(res.data);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: `Ocorreu um erro no envio recebimento da requisição: ${err}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const onsubmit = async ({ client, idwaiter, controlnumber }) => {
    api
      .post("control", { client, controlnumber, idwaiter })
      .then((res) => {
        toast({
          title: "Criado",
          description: `Comanda criada com sucesso: ${res.status}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        onCreateControl(controlCreated + 1);
      })
      .catch((err) => {
        console.log(err);

        toast({
          title: "Erro",
          description: `Ocorreu um erro no envio recebimento da requisição`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        onCreateControl(controlCreated + 1);
      });
  };

  useEffect(() => {
    findComponents();
  }, [controlCreated]);

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal">
        Abrir
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Abrir Comanda</ModalHeader>
          <ModalCloseButton />
          <Box w={"100%"} mb={12}>
            <form onSubmit={handleSubmit(onsubmit)}>
              <FormControl
                w={"100%"}
                display={"flex"}
                flexDir={"column"}
                isInvalid={errors.name}
                gap={8}
              >
                <ModalBody>
                  <FormLabel htmlFor="client"> Cliente </FormLabel>
                  <Input
                    id="client"
                    type="text"
                    placeholder="Nome do Cliente"
                    {...register("client", {
                      required: "Esse campo é obrigatório",
                    })}
                    mb={8}
                  />

                  <FormLabel htmlFor="idwaiter"> Garçom </FormLabel>
                  <Select
                    id="waiter"
                    {...register("idwaiter", {
                      required: "Esse campo é obrigatório",
                    })}
                    mb={8}
                  >
                    {!waiters.payload ? (
                      <option value={""}></option>
                    ) : (
                      waiters.payload.content.map((waiter) => (
                        <option key={waiter.idwaiter} value={waiter.idwaiter}>
                          {waiter.waiter}
                        </option>
                      ))
                    )}
                  </Select>

                  <FormLabel htmlFor="number"> Número da Comanda </FormLabel>
                  <Select
                    id="number"
                    {...register("controlnumber", {
                      required: "Esse campo é obrigatório",
                    })}
                    mb={8}
                  >
                    {availableControls === [] ? (
                      <option value={""}></option>
                    ) : (
                      availableControls.map((number) => (
                        <option key={number} value={number}>
                          {number}
                        </option>
                      ))
                    )}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <FormErrorMessage>
                    {errors?.client?.message}
                    {errors?.waiter?.message}
                    {errors?.number?.message}
                  </FormErrorMessage>

                  <Button
                    alignSelf={"end"}
                    w={36}
                    colorScheme="teal"
                    mt={8}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    {" "}
                    Abrir{" "}
                  </Button>
                </ModalFooter>
              </FormControl>
            </form>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
