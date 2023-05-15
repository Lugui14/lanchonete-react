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
import { fetchWaiters } from "../../store/reducers/waiters";
import { api } from "../../services/api";

export const Waiters = () => {
  const dispatch = useDispatch();
  const waiters = useSelector((state) => state.waiters);

  const findWaiters = async () => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(`waiter`)
      .then((res) => {
        dispatch(fetchWaiters({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findWaiters();
  }, []);

  return (
    <Flex flexDir={"column"}>
      <Heading mb={8}> Garçons </Heading>
      <TableContainer>
        <Table>
          <TableCaption> Garçons </TableCaption>
          <Thead>
            <Tr>
              <Th isNumeric>Id</Th>
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
                  <Td>{waiter.salary}</Td>
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
