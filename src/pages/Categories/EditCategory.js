import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const EditCategory = () => {
  const { idcategory } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();
  const [category, setCategory] = useState(null);

  const getCategory = async () => {
    api
      .get(`category/${idcategory}`)
      .then((res) => {
        setCategory(res.data)
      })
      .catch((err) => {
        window.history.back();
      });
  };

  useEffect(() => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");
    getCategory();
  }, []);

  const oncategorysubmit = ({ categoryname, description }) => {
    api
      .put(`category`, {
        idcategory: idcategory,
        category: categoryname || category.category,
        iscategoryactive: true,
        description: description || category.description,
      })
      .then((res) => {
        toast({
          title: "Atualizada",
          description: "Categoria atualizada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Categoria não foi atualizada",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex
      flexDir={"column"}
      w={"100%"}
      h={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Heading mb={12}> Editar Categoria </Heading>

      <form onSubmit={handleSubmit(oncategorysubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="categoryname">Nome da Categoria</FormLabel>
          <Input
            mb={8}
            id="categoryname"
            {...register("categoryname")}
            defaultValue={category?.category}
          />

          <FormLabel htmlFor="description">Descrição</FormLabel>
          <Textarea
            mb={8}
            id="description"
            {...register("description")}
            defaultValue={category?.description}
          />

          <Flex w={"100%"} justifyContent={"flex-end"}>
            <Button isLoading={isSubmitting} colorScheme="teal" type="submit">
              Atualizar
            </Button>
          </Flex>
        </FormControl>
      </form>
    </Flex>
  );
};
