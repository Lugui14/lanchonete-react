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
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const EditWaiter = () => {
  const { idwaiter } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const toast = useToast();
  const [waiter, setWaiter] = useState(null);

  const getWaiter = async () => {
    api
      .get(`waiter/${idwaiter}`)
      .then((res) => {
        setWaiter(res.data);
      })
      .catch((err) => {
        window.history.back();
      });
  };

  useEffect(() => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");
    getWaiter();
  }, []);

  const onwaitersubmit = ({ waitername, salary }) => {
    api
      .put(`waiter`, {
        idwaiter: idwaiter,
        waiter: waitername || waiter.waiter,
        salary: salary || waiter.salary,
      })
      .then((res) => {
        toast({
          title: "Atualizado",
          description: "Garçom atualizado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Garçom não foi atualizado",
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
      <Heading mb={12}> Editar Garçom </Heading>

      <form onSubmit={handleSubmit(onwaitersubmit)}>
        <FormControl isInvalid={errors.name}>
          <FormLabel htmlFor="waitername">Nome do Garçom</FormLabel>
          <Input
            mb={8}
            id="waitername"
            {...register("waitername")}
            defaultValue={waiter?.waiter}
          />

          <FormLabel htmlFor="salary">Salario</FormLabel>
          <NumberInput mb={8} min={1250} step={0.1} id="salary">
            <NumberInputField
              placeholder={waiter?.salary}
              {...register("salary")}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

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
