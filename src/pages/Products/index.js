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
  MenuList,
  MenuItem,
  Link,
  Select,
  Menu,
  MenuButton,
  Button,
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
import { fetchProducts } from "../../store/reducers/products";
import { api } from "../../services/api";
import { CreateProduct } from "../../components/Forms/CreateProduct";

export const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const toast = useToast();
  const [total, setTotal] = useState(18);
  const [updates, setUpdates] = useState(0);
  const [productactive, setProductactive] = useState(true);

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

  const findProducts = async (isactive, page) => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(
        `product/isactive=${isactive}?size=${PAGESIZE}&sort=idproduct,desc&page=${page}`
      )
      .then((res) => {
        dispatch(fetchProducts({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findProducts(productactive, currentPage - 1);
  }, [currentPage, pageSize, offset, updates, productactive]);

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  const handleChangeActive = (active) => {
    setProductactive(active);
  };

  const handleDeleteProduct = async (idproduct) => {
    api
      .delete(`product/${idproduct}`)
      .then((res) => {
        toast({
          title: "Desativado",
          description: "Produto desativado com sucesso",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setUpdates(updates + 1);
      })
      .catch((err) => {
        toast({
          title: "Erro",
          description: "Não foi possível desativar o produto",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Flex justifyContent={"space-between"}>
        <Heading mb={8}> Produtos </Heading>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Select
            mr={6}
            maxW={28}
            id="productactive"
            onChange={(event) => {
              handleChangeActive(event.target.value);
            }}
          >
            <option value={true}> Ativos </option>
            <option value={false}> Inativos </option>
          </Select>
          <CreateProduct
            productUpdate={updates}
            setProductUpdate={setUpdates}
          />
        </Flex>
      </Flex>
      <TableContainer>
        <Table>
          <TableCaption> Produtos </TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Produto</Th>
              <Th>Categoria</Th>
              <Th>Descrição</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.payload ? (
              products.payload.content.map((product) => (
                <Tr>
                  <Td>{product.idproduct}</Td>
                  <Td>{product.product}</Td>
                  <Td>{product.category}</Td>
                  <Td>{product.description}</Td>
                  <Td>
                    <Menu>
                      <MenuButton as={Button}> Ações </MenuButton>
                      <MenuList>
                        <Link href={`/products/${product.idproduct}`}>
                          <MenuItem>Editar</MenuItem>
                        </Link>

                        <MenuItem
                          onClick={() => {
                            handleDeleteProduct(product.idproduct);
                          }}
                        >
                          Desativar
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            ) : (
              <>
                <Td>Loading</Td>
                <Td>Loading</Td>
                <Td>Loading</Td>
                <Td>Loading</Td>
                <Td>Loading</Td>
              </>
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
