import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const EditProduct = () => {
  const { idproduct } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState(null);

  const getProduct = async () => {
    api
      .get(`product/${idproduct}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        window.history.back();
      });

    api
      .get(`category/isactive=true?size=100`)
      .then((res) => {
        setCategories(res.data.content);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao carregar categorias",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");
    getProduct();
  }, []);

  const onproducteditsubmit = ({
    productname,
    price,
    idcategory,
    description,
  }) => {
    api
      .put(`product`, {
        idproduct: idproduct,
        product: productname || product.product,
        isproductactive: true,
        price: price || product.price,
        description: description || product.description,
        idcategory:
          idcategory ||
          categories.find((category) => category.category === product?.category)
            .idcategory,
      })
      .then((res) => {
        toast({
          title: "Atualizado",
          description: "Produto atualizado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Produto não foi atualizado",
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
      <Heading mb={12}> Editar Produto </Heading>

      <form onSubmit={handleSubmit(onproducteditsubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="productname">Nome do Produto</FormLabel>
          <Input
            mb={8}
            id="productname"
            {...register("productname")}
            defaultValue={product?.product}
          />

          <FormLabel htmlFor="price">Preço do Produto</FormLabel>
          <NumberInput mb={8} min={0} step={0.1}>
            <NumberInputField
              placeholder={product?.price}
              id="price"
              {...register("price")}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <FormLabel htmlFor="idcategory">Categoria</FormLabel>
          <Select mb={8} id="idcategory" {...register("idcategory")}>
            {categories?.map((category) => {
              return category.category === product?.category ? (
                <option
                  key={category.idcategory}
                  value={category.idcategory}
                  selected
                >
                  {category.category}
                </option>
              ) : (
                <option key={category.idcategory} value={category.idcategory}>
                  {category.category}
                </option>
              );
            })}
          </Select>

          <FormLabel htmlFor="description">Descrição</FormLabel>
          <Textarea
            mb={8}
            id="description"
            {...register("description")}
            defaultValue={product?.description}
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
