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
import { useForm } from "react-hook-form";
import { api } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/reducers/products";

export const CreateRequest = ({
  idcontrol,
  productsUpdate,
  setProductUpdate,
}) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const products = useSelector((state) => state.products);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const findComponents = async () => {
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
  };

  const onproductsubmit = ({ idproduct }) => {
    api
      .post(`request`, {
        idproduct,
        idcontrol,
      })
      .then((res) => {
        toast({
          title: "Criado",
          description: "Pedido criado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setProductUpdate(productsUpdate + 1);
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
    api.defaults.headers.common.Authorization = localStorage.getItem("token");
  }, []);

  return <div>CreateRequest</div>;
};
