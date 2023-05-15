import React, { useEffect } from "react";
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
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/reducers/logged";
import { fetchCategories } from "../../store/reducers/category";
import { api } from "../../services/api";

export const Categories = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories);

  const findCategories = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(`category?orderBy=idcategory`)
      .then((res) => {
        dispatch(fetchCategories({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findCategories();
  }, []);

  return (
    <Flex flexDir={"column"}>
      <Heading mb={8}> Categorias </Heading>
      <TableContainer>
        <Table>
          <TableCaption> Categorias </TableCaption>
          <Thead>
            <Tr>
              <Th isNumeric>Id</Th>
              <Th>Categoria</Th>
              <Th>Descrição</Th>
            </Tr>
          </Thead>
          {categories.payload ? (
            <Tbody>
              {categories.payload.content.map((category) => (
                <Tr>
                  <Td>{category.idcategory}</Td>
                  <Td>{category.category}</Td>
                  <Td>{category.description}</Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Heading>Loading</Heading>
          )}
        </Table>
      </TableContainer>
    </Flex>
  );
};
