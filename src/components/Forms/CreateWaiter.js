import React, { useEffect } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  NumberInput,
  NumberIncrementStepper,
  NumberInputField,
  NumberDecrementStepper,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const CreateWaiter = ({ waiterUpdate, setWaiterUpdate }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const findComponents = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");
  };

  const onwaitersubmit = ({ waiter, salary }) => {
    api
      .post(`waiter`, {
        waiter,
        salary,
      })
      .then((res) => {
        toast({
          title: "Criado",
          description: "Garçom criado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setWaiterUpdate(waiterUpdate + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao criar garçom",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    findComponents();
  }, []);

  return (
    <>
      <Button alignSelf={"center"} w={48} onClick={onOpen} colorScheme="teal">
        Criar Garçom
      </Button>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Garçom</ModalHeader>
          <ModalCloseButton />
          <Box w={"100%"} mb={12}>
            <form onSubmit={handleSubmit(onwaitersubmit)}>
              <FormControl
                w={"100%"}
                display={"flex"}
                flexDir={"column"}
                isInvalid={errors.name}
              >
                <ModalBody>
                  <FormLabel htmlFor="waiter">Nome do garçom</FormLabel>
                  <Input
                    mb={8}
                    id="waiter"
                    placeholder="Garçom"
                    {...register("waiter", {
                      required: "Esse campo é obrigatorio",
                    })}
                  />

                  <FormLabel htmlFor="description">Salário do garçom</FormLabel>
                  <NumberInput defaultValue={1300} min={1250} step={0.1}>
                    <NumberInputField
                      {...register("salary", {
                        required: "Esse campo é obrigatório",
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </ModalBody>
                <ModalFooter>
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
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
                    Criar{" "}
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
