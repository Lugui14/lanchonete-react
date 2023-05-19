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
  Text,
  InputGroup,
  InputLeftAddon,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { api } from "../../services/api";

export const CreatePayment = ({
  idcontrol,
  paymentUpdate,
  setPaymentUpdate,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentMethods, setPaymentMethods] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const findComponents = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    api
      .get(`paymentmethod`)
      .then((res) => {
        setPaymentMethods(res.data.content);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao requisitar os metodos de pagamento",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const onrequestsubmit = ({ amountpaid, paymentdetail, idpaymentmethod }) => {
    api
      .post(`payment`, {
        amountpaid,
        paymentdetail,
        idcontrol,
        idpaymentmethod,
      })
      .then((res) => {
        toast({
          title: "Criado",
          description: "Pagamento criado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setPaymentUpdate(paymentUpdate + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Erro ao criar pagamento",
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
        + Pagamento
      </Button>

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fazer Pagamento</ModalHeader>
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
                  <Text mb={8}>
                    <b> COMANDA: {idcontrol}</b>
                  </Text>

                  <FormLabel htmlFor="amountpaid">Quantia em reais</FormLabel>
                  <InputGroup mb={8}>
                    <InputLeftAddon children="R$" />
                    <Input
                      placeholder="Valor em R$"
                      id="amountpaid"
                      {...register("amountpaid", {
                        required: "Esse campo é obrigatório",
                      })}
                    />
                  </InputGroup>

                  <FormLabel htmlFor="idpaymentmethod">
                    Metodo de pagamento
                  </FormLabel>
                  <Select
                    mb={8}
                    id="idpaymentmethod"
                    placeholder="Metodos de pagamento"
                    {...register("idpaymentmethod", {
                      required: "Esse campo é obrigatorio",
                    })}
                  >
                    {!paymentMethods ? (
                      <option value={""}></option>
                    ) : (
                      paymentMethods.map((paymentmethod) => (
                        <option
                          key={paymentmethod.idpaymentmethod}
                          value={paymentmethod.idpaymentmethod}
                        >
                          {paymentmethod.paymentmethod}
                        </option>
                      ))
                    )}
                  </Select>

                  <FormLabel htmlFor="paymentdetail">Detalhes</FormLabel>
                  <Textarea
                    mb={8}
                    placeholder="Detalhes sobre o pagamento"
                    {...register("paymentdetail")}
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
                    Pagar{" "}
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
