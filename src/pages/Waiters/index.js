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
import { fetchWaiters } from "../../store/reducers/waiters";
import { api } from "../../services/api";

export const Waiters = () => {
  const dispatch = useDispatch();
  const waiters = useSelector((state) => state.waiters);
  const [total, setTotal] = useState(18);
  const PAGESIZE = 6;

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

  const findWaiters = async (page) => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(`waiter?sort=idwaiter,asc&page=${page}&size=${PAGESIZE}`)
      .then((res) => {
        dispatch(fetchWaiters({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findWaiters(currentPage - 1);
  }, [currentPage, pageSize, offset]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Heading mb={8}> Garçons </Heading>
      <TableContainer>
        <Table>
          <TableCaption> Garçons </TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Nome</Th>
              <Th isNumeric>Salario</Th>
            </Tr>
          </Thead>
          {waiters.payload ? (
            <Tbody>
              {waiters.payload.content.map((waiter) => (
                <Tr>
                  <Td>{waiter.idwaiter}</Td>
                  <Td>{waiter.waiter}</Td>
                  <Td isNumeric>R$ {waiter.salary}</Td>
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
