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
  Textarea,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/reducers/category";

export const CreateProduct = ({ productUpdate, setProductUpdate }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const categories = useSelector((state) => state.categories);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const findComponents = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    api
      .get(`category?size=100`)
      .then((res) => {
        dispatch(fetchCategories(res.data));
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao requisitar as categorias",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const onproductsubmit = ({ product, price, description, idcategory }) => {
    api
      .post(`product`, {
        product,
        price,
        description,
        idcategory,
      })
      .then((res) => {
        toast({
          title: "Criado",
          description: "Produto criado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setProductUpdate(productUpdate + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao criar produto",
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
        Criar Produto
      </Button>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Produto</ModalHeader>
          <ModalCloseButton />
          <Box w={"100%"} mb={12}>
            <form onSubmit={handleSubmit(onproductsubmit)}>
              <FormControl
                w={"100%"}
                display={"flex"}
                flexDir={"column"}
                isInvalid={errors.name}
              >
                <ModalBody>
                  <FormLabel htmlFor="product">Nome do produto</FormLabel>
                  <Input
                    mb={8}
                    id="product"
                    placeholder="Produto"
                    {...register("product", {
                      required: "Esse campo é obrigatorio",
                    })}
                  />

                  <FormLabel htmlFor="idcategory">Categoria</FormLabel>
                  <Select
                    placeholder="Categoria do produto"
                    mb={8}
                    {...register("idcategory", {
                      required: "Esse campo é obrigatorio",
                    })}
                  >
                    {!categories?.content ? (
                      <option value={""}></option>
                    ) : (
                      categories?.content.map((category) => (
                        <option
                          key={category.idcategory}
                          value={category.idcategory}
                        >
                          {category.category}
                        </option>
                      ))
                    )}
                  </Select>

                  <FormLabel htmlFor="price">Preço</FormLabel>
                  <InputGroup mb={8}>
                    <InputLeftAddon children="R$" />
                    <Input
                      id="price"
                      placeholder="Preço do produto"
                      {...register("price", {
                        required: "Esse campo é obrigatorio",
                      })}
                    />
                  </InputGroup>

                  <FormLabel htmlFor="description">
                    Descrição do produto
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
