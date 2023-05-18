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

export const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.requests);
  const [total, setTotal] = useState(18);
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

  useEffect(() => {
    findRequests(currentPage - 1);
  }, [currentPage, pageSize, offset]);

  // handlers
  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Heading mb={8}> Requests </Heading>
      <TableContainer>
        <Table>
          <TableCaption> Requests </TableCaption>
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
                  <Td>{STATUSPEDIDOS[request.requeststatus]}</Td>
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
                bg="gray.200"
                key={`pagination_page_${page}`}
                page={page}
                fontSize="sm"
                _hover={{
                  bg: "gray.300",
                }}
                _current={{
                  bg: "gray.400",
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
