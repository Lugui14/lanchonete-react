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
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const CreateCategory = ({ categoryUpdate, setCategoryUpdate }) => {
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

  const oncategorysubmit = ({ category, description }) => {
    api
      .post(`category`, {
        category,
        description,
      })
      .then((res) => {
        toast({
          title: "Criado",
          description: "Categoria criada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setCategoryUpdate(categoryUpdate + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao criar categoria",
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
        Criar Categoria
      </Button>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Categoria</ModalHeader>
          <ModalCloseButton />
          <Box w={"100%"} mb={12}>
            <form onSubmit={handleSubmit(oncategorysubmit)}>
              <FormControl
                w={"100%"}
                display={"flex"}
                flexDir={"column"}
                isInvalid={errors.name}
              >
                <ModalBody>
                  <FormLabel htmlFor="category">Nome da categoria</FormLabel>
                  <Input
                    mb={8}
                    id="category"
                    placeholder="Categoria"
                    {...register("category", {
                      required: "Esse campo é obrigatorio",
                    })}
                  />

                  <FormLabel htmlFor="description">
                    Descrição da categoria
                  </FormLabel>
                  <Textarea
                    mb={8}
                    placeholder="Descrição"
                    {...register("description")}
                  />
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
