import React, { useEffect } from "react";
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
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/reducers/products";
import { fetch } from "../../store/reducers/controls";

export const CreateRequest = ({
  idcontrol,
  requestUpdate,
  setRequestUpdate,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const products = useSelector((state) => state.products);
  const controls = useSelector((state) => state.controls);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const findComponents = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    api
      .get(`product?size=100`)
      .then((res) => {
        dispatch(fetchProducts(res.data));
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao requisitar os produtos",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });

    !idcontrol &&
      api
        .get(`control/opened=true`)
        .then((res) => {
          dispatch(fetch(res.data));
        })
        .catch((err) => {
          toast({
            title: "Erro",
            description: "Erro ao requisitar as comandas",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
  };

  const onrequestsubmit = ({ idproduct, idc }) => {
    api
      .post(`request`, {
        idproduct: idproduct,
        idcontrol: idc,
      })
      .then((res) => {
        toast({
          title: "Criado",
          description: "Pedido criado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setRequestUpdate(requestUpdate + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao criar pedido",
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
        + Pedido
      </Button>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fazer Pedido</ModalHeader>
          <ModalCloseButton />
          <Box w={"100%"} mb={12}>
            <form onSubmit={handleSubmit(onrequestsubmit)}>
              <FormControl
                w={"100%"}
                display={"flex"}
                flexDir={"column"}
                isInvalid={errors.name}
              >
                <ModalBody>
                  <FormLabel htmlFor="idproduct">Produto</FormLabel>
                  <Select
                    mb={8}
                    placeholder="Selecione um Produto"
                    id="idproduct"
                    {...register("idproduct", {
                      required: "Esse campo é obrigatório",
                    })}
                  >
                    {!products?.content ? (
                      <option value={""}></option>
                    ) : (
                      products?.content.map((product) => (
                        <option
                          key={product.idproduct}
                          value={product.idproduct}
                        >
                          {product.product}
                        </option>
                      ))
                    )}
                  </Select>

                  {idcontrol ? (
                    <>
                      <Text>
                        <b> COMANDA: {idcontrol}</b>
                      </Text>
                      <Input
                        type="hidden"
                        id="idc"
                        value={idcontrol}
                        {...register("idc", {
                          required: "Por favor, não tente burlar o sistema",
                        })}
                      />
                    </>
                  ) : (
                    <>
                      <FormLabel htmlFor="idc"></FormLabel>
                      <Select
                        id="idc"
                        placeholder="Id da comanda"
                        {...register("idc", {
                          required: "Esse campo é obrigatório",
                        })}
                      >
                        {!controls?.content ? (
                          <option value=""></option>
                        ) : (
                          controls?.content.map((control) => (
                            <option
                              key={control.idcontrol}
                              value={control.idcontrol}
                            >
                              {control.controlnumber}
                            </option>
                          ))
                        )}
                      </Select>
                    </>
                  )}
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
                    Pedir{" "}
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
