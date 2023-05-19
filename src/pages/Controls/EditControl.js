import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import {
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  useToast,
  Flex,
  Stack,
  Button,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  TableContainer,
  Table,
  TableCaption,
  Tr,
  Tbody,
  Thead,
  Th,
  Td,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateRequest } from "../../components/Forms/CreateRequest";
import { CreatePayment } from "../../components/Forms/CreatePayment";

export const EditControl = () => {
  const { idcontrol } = useParams();
  const toast = useToast();
  const [requests, setRequests] = useState(null);
  const [waiters, setWaiters] = useState(null);
  const [availableControls, setAvailableControls] = useState(null);
  const [payments, setPayments] = useState(null);
  const [control, setControl] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const [updates, setUpdates] = useState(0);

  const STATUSPEDIDOS = ["Pedido", "Preparando", "Pronto", "Pago", "Cancelado"];

  const getControl = async (id) => {
    api
      .get(`control/${id}`)
      .then((res) => {
        setControl(res.data);
      })
      .catch((err) => {
        window.history.back();
      });

    api
      .get(`request/${id}?sort=idrequest,desc`)
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Ocorreu um erro na requisição dos pedidos",
          status: "error",
          isClosable: true,
          duration: 5000,
        });
      });

    api
      .get(`waiter`)
      .then((res) => {
        setWaiters(res.data);
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
      .get(`payment/${id}`)
      .then((res) => {
        setPayments(res.data);
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

  const onsubmitEditControl = ({ client, discount, idwaiter, number }) => {
    let requestbody = number
      ? {
          idcontrol: control.idcontrol,
          client: client || control.client,
          discount: discount || control.discount,
          idwaiter:
            idwaiter ||
            waiters?.content.find((waiter) => waiter.waiter === control.waiter)
              .idwaiter,
          controlnumber: number,
        }
      : {
          idcontrol: control.idcontrol,
          client: client || control.client,
          discount: discount || control.discount,
          idwaiter:
            idwaiter ||
            waiters?.content.find((waiter) => waiter.waiter === control.waiter)
              .idwaiter,
        };

    api
      .put("control", requestbody)
      .then((res) => {
        toast({
          title: "Atualizado",
          description: "Comanda atualizada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setUpdates(updates + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Comanda não foi atualizada, verifique os dados",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleRequestStatusChange = async (idrequest, status) => {
    status !== 4
      ? api
          .put("request", {
            idrequest,
            requeststatus: status,
          })
          .then((res) => {
            toast({
              title: "Status Atualizado",
              description: "Status do pedido atualizado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: true,
            });

            setUpdates(updates + 1);
          })
          .catch((err) => {
            toast({
              title: "Erro",
              description: "Erro na atualização do pedido",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          })
      : api
          .delete(`request/${idrequest}`)
          .then((res) => {
            toast({
              title: "Pedido cancelado",
              description: "Pedido cancelado com sucesso",
              status: "success",
              duration: 5000,
              isClosable: true,
            });

            setUpdates(updates + 1);
          })
          .catch((err) => {
            toast({
              title: "Erro",
              description: "Erro no cancelamento do pedido",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
  };

  const handleDeleteControl = async (id) => {
    api
      .delete(`control/${id}`)
      .then((res) => {
        toast({
          title: "Fechada",
          description: `Comanda fechada com sucesso: ${res.status}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        window.location.href = "/controls";
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "Erro",
          description:
            "Não foi possível fechar a comanda pois existem pendências nela",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    getControl(idcontrol);
  }, [updates]);

  return (
    <>
      <Grid w={"100%"} h={"100%"} templateColumns={"repeat(2, 1fr)"} gap={2}>
        <GridItem w={"100%"} h={"100%"} pt={12} pl={12}>
          <Heading as="h3" mb={16}>
            Dados da Comanda
          </Heading>

          <form onSubmit={handleSubmit(onsubmitEditControl)}>
            <FormControl
              w={"100%"}
              display={"flex"}
              flexDir={"column"}
              isInvalid={errors.name}
              pr={24}
              mb={8}
            >
              <FormLabel htmlFor="client"> Cliente </FormLabel>
              <Input
                w={64}
                mb={8}
                defaultValue={control?.client}
                id="client"
                type="text"
                max={50}
                {...register("client")}
              />

              <Flex justifyContent={"space-between"}>
                <Stack>
                  <FormLabel htmlFor="idwaiter"> Garçom </FormLabel>
                  <Select w={56} id="idwaiter" {...register("idwaiter")}>
                    {!waiters ? (
                      <option value=""></option>
                    ) : (
                      waiters.content.map((waiter) =>
                        waiter.waiter === control?.waiter ? (
                          <option
                            selected
                            key={waiter.idwaiter}
                            value={waiter.idwaiter}
                          >
                            {waiter.waiter}
                          </option>
                        ) : (
                          <option key={waiter.idwaiter} value={waiter.idwaiter}>
                            {waiter.waiter}
                          </option>
                        )
                      )
                    )}
                  </Select>
                </Stack>
                <Stack mb={8}>
                  <FormLabel htmlFor="number"> Número </FormLabel>
                  <Select
                    id="number"
                    {...register("number")}
                    placeholder={control ? control.controlnumber : ""}
                  >
                    {!availableControls ? (
                      <option value=""></option>
                    ) : (
                      availableControls.map((number) => {
                        return (
                          <option key={number} value={number}>
                            {number}
                          </option>
                        );
                      })
                    )}
                  </Select>
                </Stack>
              </Flex>

              <FormLabel htmlFor="discount"> Desconto em reais </FormLabel>
              <NumberInput
                w={36}
                mb={8}
                id="discount"
                step={0.1}
                min={0}
                max={0.5}
              >
                <NumberInputField
                  placeholder={control?.discount}
                  {...register("discount")}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              {control ? (
                <>
                  <Text>
                    {" "}
                    A Pagar:{" "}
                    <b>
                      {control.topay.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </b>{" "}
                  </Text>
                  <Text>
                    Entrada: <b>{new Date(control.entrace).toString()}</b>
                  </Text>
                </>
              ) : (
                <Text> Loading </Text>
              )}

              <Flex justifyContent={"space-between"} alignItems={"end"}>
                <Button
                  onClick={() => {
                    handleDeleteControl(control.idcontrol);
                  }}
                  w={36}
                  colorScheme="red"
                >
                  Fechar Comanda
                </Button>

                <Button
                  w={36}
                  colorScheme="teal"
                  mt={8}
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Atualizar
                </Button>
              </Flex>
            </FormControl>
          </form>
        </GridItem>

        <GridItem
          w={"100%"}
          h={"100%"}
          borderLeft={"1px solid"}
          borderColor={"gray.200"}
          pl={12}
          pt={12}
        >
          <Flex flexDir={"column"} mb={8}>
            <Heading as={"h3"} mb={8} fontSize={"1.5rem"}>
              {" "}
              Pedidos{" "}
            </Heading>
            <TableContainer mb={4}>
              <Table>
                <TableCaption> Requests </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Produto</Th>
                    <Th>status</Th>
                    <Th isNumeric>Valor</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests ? (
                    requests.content.map((request) => (
                      <Tr key={request.idrequest}>
                        <Td>{request.idrequest}</Td>
                        <Td>{request.product}</Td>
                        <Td>
                          <Select
                            w={36}
                            onChange={(event) => {
                              handleRequestStatusChange(
                                request.idrequest,
                                event.target.value
                              );
                            }}
                          >
                            {STATUSPEDIDOS.map((statuspedido) => {
                              return STATUSPEDIDOS.indexOf(statuspedido) ===
                                request.requeststatus ? (
                                <option
                                  key={STATUSPEDIDOS.indexOf(statuspedido)}
                                  value={STATUSPEDIDOS.indexOf(statuspedido)}
                                  selected
                                >
                                  {statuspedido}
                                </option>
                              ) : (
                                <option
                                  key={STATUSPEDIDOS.indexOf(statuspedido)}
                                  value={STATUSPEDIDOS.indexOf(statuspedido)}
                                >
                                  {statuspedido}
                                </option>
                              );
                            })}
                          </Select>
                        </Td>
                        <Td isNumeric>R$ {request.vlvenda}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td>Loading</Td>
                      <Td>Loading</Td>
                      <Td>Loading</Td>
                      <Td>Loading</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            <CreateRequest
              idcontrol={idcontrol}
              requestUpdate={updates}
              setRequestUpdate={setUpdates}
            />
          </Flex>

          <Flex flexDir={"column"} mb={8}>
            <Heading as={"h3"} fontSize={"1.5rem"} mb={8}>
              Pagamentos
            </Heading>

            <TableContainer>
              <Table>
                <TableCaption> Pagamentos </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>Quantia</Th>
                    <Th>Metodo</Th>
                    <Th>Detalhes</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {requests ? (
                    payments.content.map((payment) => (
                      <Tr key={payment.idpayment}>
                        <Td>{payment.idpayment}</Td>
                        <Td>R$ {payment.amountpaid}</Td>
                        <Td>{payment.paymentmethod}</Td>
                        <Td isNumeric>{payment.paymentdetail}</Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td>Loading</Td>
                      <Td>Loading</Td>
                      <Td>Loading</Td>
                      <Td>Loading</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            <CreatePayment
              idcontrol={idcontrol}
              paymentUpdate={updates}
              setPaymentUpdate={setUpdates}
            />
          </Flex>
        </GridItem>
      </Grid>
    </>
  );
};
