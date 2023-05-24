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
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  useToast,
  Button,
  Link,
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
import { CreateCategory } from "../../components/Forms/CreateCategory";
import { signOut } from "../../store/reducers/logged";
import { fetchCategories } from "../../store/reducers/category";
import { api } from "../../services/api";

export const Categories = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const categories = useSelector((state) => state.categories);
  const [total, setTotal] = useState(18);
  const [updates, setUpdates] = useState(0);
  const [active, setAtive] = useState(true);

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

  const findCategories = async (page, isactive) => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    api
      .get(
        `category/isactive=${isactive}?sort=idcategory,asc&page=${page}&size=${PAGESIZE}`
      )
      .then((res) => {
        dispatch(fetchCategories({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findCategories(currentPage - 1, active);
  }, [currentPage, pageSize, offset, updates, active]);

  const handleDeleteCategory = async (idcategory) => {
    api
      .delete(`category/${idcategory}`)
      .then((res) => {
        toast({
          title: "Desativado",
          description: "Categoria desativada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setUpdates(updates + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Não foi possível desativar a categoria",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleActiveCategory = async (category) => {
    api
      .put("category", {
        idcategory: category.idcategory,
        iscategoryactive: true,
      })
      .then((res) => {
        toast({
          title: "Ativada",
          description: "Categoria ativada com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setUpdates(updates + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Categoria não foi ativada",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Flex justifyContent={"space-between"}>
        <Heading mb={8}> Categorias </Heading>

        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Select
            mr={4}
            maxW={36}
            onChange={(event) => {
              setAtive(event.target.value);
            }}
          >
            <option value={true}>Ativos</option>
            <option value={false}>Inativos</option>
          </Select>
          <CreateCategory
            categoryUpdate={updates}
            setCategoryUpdate={setUpdates}
          />
        </Flex>
      </Flex>
      <TableContainer>
        <Table>
          <TableCaption> Categorias </TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Categoria</Th>
              <Th>Descrição</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.payload ? (
              categories.payload.content.map((category) => (
                <Tr key={category.idcategory}>
                  <Td>{category.idcategory}</Td>
                  <Td>{category.category}</Td>
                  <Td>{category.description}</Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button}> Ações </MenuButton>
                      <MenuList>
                        {category.isactive ? (
                          <>
                            <Link href={`/categories/${category.idcategory}`}>
                              <MenuItem>Editar</MenuItem>
                            </Link>
                            <MenuItem
                              onClick={() => {
                                handleDeleteCategory(category.idcategory);
                              }}
                            >
                              Desativar
                            </MenuItem>
                          </>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              handleActiveCategory(category);
                            }}
                          >
                            Ativar
                          </MenuItem>
                        )}
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
