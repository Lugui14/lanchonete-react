import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Text,
  Select,
  useToast,
} from "@chakra-ui/react";

import {
  Pagination,
  usePagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
} from "@ajna/pagination";

import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/reducers/logged";
import { fetchRequests } from "../../store/reducers/requests";
import { api } from "../../services/api";
import { CreateRequest } from "../../components/Forms/CreateRequest";

export const Requests = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const requests = useSelector((state) => state.requests);
  const [total, setTotal] = useState(18);
  const [updates, setUpdates] = useState(0);
  const PAGESIZE = 6;

  const STATUSPEDIDOS = ["Pedido", "Preparando", "Pronto", "Pago", "Cancelado"];

  // pagination hook
  const {
    pages,
    pagesCount,
    offset,
    currentPage,
    setCurrentPage,
    isDisabled,
    pageSize,
  } = usePagination({
    total: total,
    limits: {
      outer: 2,
      inner: 2,
    },
    initialState: {
      pageSize: PAGESIZE,
      isDisabled: false,
      currentPage: 1,
    },
  });

  const findRequests = async (page) => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(`request?size=${PAGESIZE}&sort=idrequest,desc&page=${page}`)
      .then((res) => {
        dispatch(fetchRequests({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
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

  useEffect(() => {
    findRequests(currentPage - 1);
  }, [currentPage, pageSize, offset, updates]);

  // handlers
  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Flex justifyContent={"space-between"}>
        <Heading mb={8}> Pedidos </Heading>
        <CreateRequest
          idcontrol={null}
          requestUpdate={updates}
          setRequestUpdate={setUpdates}
        />
      </Flex>
      <TableContainer>
        <Table>
          <TableCaption> Pedidos </TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Produto</Th>
              <Th>status</Th>
              <Th isNumeric>Valor</Th>
              <Th isNumeric>Comanda</Th>
            </Tr>
          </Thead>
          {requests.payload ? (
            <Tbody>
              {requests.payload.content.map((request) => (
                <Tr>
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
                  <Td isNumeric>{request.vlvenda}</Td>
                  <Td isNumeric>{request.controlnumber}</Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Heading>Loading</Heading>
          )}
        </Table>
      </TableContainer>

      <Pagination
        pagesCount={pagesCount}
        currentPage={currentPage}
        isDisabled={isDisabled}
        onPageChange={handlePageChange}
      >
        <PaginationContainer
          align="center"
          justify="space-between"
          p={4}
          w="full"
        >
          <PaginationPrevious colorScheme="teal">
            <Text>
              <AiFillCaretLeft />
            </Text>
          </PaginationPrevious>
          <PaginationPageGroup
            isInline
            align="center"
            separator={
              <PaginationSeparator fontSize="sm" w={7} jumpSize={11} />
            }
          >
            {pages.map((page) => (
              <PaginationPage
                w={7}
                bg="gray.400"
                key={`pagination_page_${page}`}
                page={page}
                fontSize="sm"
                _hover={{
                  bg: "gray.500",
                }}
                _current={{
                  bg: "gray.600",
                  fontSize: "sm",
                  w: 7,
                }}
              />
            ))}
          </PaginationPageGroup>
          <PaginationNext colorScheme="teal">
            <Text>
              <AiFillCaretRight />
            </Text>
          </PaginationNext>
        </PaginationContainer>
      </Pagination>
    </Flex>
  );
};
