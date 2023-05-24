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
  useToast,
  Menu,
  MenuButton,
  Button,
  Link,
  MenuItem,
  MenuList,
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
import { CreateWaiter } from "../../components/Forms/CreateWaiter";
import { signOut } from "../../store/reducers/logged";
import { fetchWaiters } from "../../store/reducers/waiters";
import { api } from "../../services/api";

export const Waiters = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const waiters = useSelector((state) => state.waiters);
  const [total, setTotal] = useState(18);
  const [updates, setUpdates] = useState(0);
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
  }, [currentPage, pageSize, offset, updates]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  const handleDeleteWaiter = async (idwaiter) => {
    api
      .delete(`waiter/${idwaiter}`)
      .then((res) => {
        toast({
          title: "Deletado",
          description: "Garçom deletado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setUpdates(updates + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Não foi possível deletar o garçom",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Flex justifyContent={"space-between"}>
        <Heading mb={8}> Garçons </Heading>
        <CreateWaiter waiterUpdate={updates} setWaiterUpdate={setUpdates} />
      </Flex>
      <TableContainer>
        <Table>
          <TableCaption> Garçons </TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Nome</Th>
              <Th isNumeric>Salario</Th>
              <Th isNumeric>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {waiters.payload ? (
              waiters.payload.content.map((waiter) => (
                <Tr>
                  <Td>{waiter.idwaiter}</Td>
                  <Td>{waiter.waiter}</Td>
                  <Td isNumeric>R$ {waiter.salary}</Td>
                  <Td isNumeric>
                    <Menu>
                      <MenuButton as={Button}> Ações </MenuButton>
                      <MenuList>
                        <Link href={`/waiters/${waiter.idwaiter}`}>
                          <MenuItem>Editar</MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            handleDeleteWaiter(waiter.idwaiter);
                          }}
                        >
                          Deletar
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
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
