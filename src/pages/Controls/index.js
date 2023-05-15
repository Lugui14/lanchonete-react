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
import { fetch } from "../../store/reducers/controls";
import { api } from "../../services/api";

export const Controls = () => {
  const dispatch = useDispatch();
  const controls = useSelector((state) => state.controls);

  const findControls = async (opened) => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(`control/opened=${opened}`)
      .then((res) => {
        dispatch(fetch({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findControls(true);
  }, []);

  return (
    <Flex flexDir={"column"}>
      <Heading mb={8}> Comandas </Heading>
      <TableContainer>
        <Table>
          <TableCaption> Comandas </TableCaption>
          <Thead>
            <Tr>
              <Th isNumeric>Id</Th>
              <Th>Cliente</Th>
              <Th>Garçom</Th>
              <Th isNumeric>Número</Th>
            </Tr>
          </Thead>
          {controls.payload ? (
            <Tbody>
              {controls.payload.content.map((control) => (
                <Tr>
                  <Td>{control.idcontrol}</Td>
                  <Td>{control.client}</Td>
                  <Td>{control.waiter}</Td>
                  <Td>{control.controlnumber}</Td>
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
