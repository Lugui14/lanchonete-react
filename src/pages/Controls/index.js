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
  Button,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
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
import { signOut } from "../../store/reducers/logged";
import { fetch } from "../../store/reducers/controls";
import { api } from "../../services/api";
import { CreateControl } from "../../components/Forms/CreateControl";

export const Controls = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const controls = useSelector((state) => state.controls);
  const [opened, setOpened] = useState(true);
  const [total, setTotal] = useState(18);
  const [controlChanged, setControlChanged] = useState(0);

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

  const findControls = async (page) => {
    api.defaults.headers.common.Authorization = localStorage.getItem("token");

    await api
      .get(
        `control/opened=${opened}?sort=idcontrol,desc&page=${page}&size=${PAGESIZE}`
      )
      .then((res) => {
        dispatch(fetch({ payload: res.data }));
        return res.data;
      })
      .catch((err) => {
        dispatch(signOut());
      });
  };

  useEffect(() => {
    findControls(currentPage - 1);
  }, [currentPage, pageSize, offset, opened, controlChanged]);

  const handleDeleteControl = async (idcontrol) => {
    api
      .delete(`control/${idcontrol}`)
      .then((res) => {
        toast({
          title: "Fechada",
          description: `Comanda fechada com sucesso: ${res.status}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setControlChanged(controlChanged + 1);
      })
      .catch((err) => {
        console.log(err);
        setControlChanged(controlChanged + 1);
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

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);

    if (nextPage !== currentPage) {
      nextPage >= currentPage ? setTotal(total + 6) : setTotal(total - 6);
    }
  };

  const handleOpenedChange = (event) => {
    setOpened(event.target.value);
  };

  return (
    <Flex flexDir={"column"} minW={"60%"}>
      <Flex justifyContent={"space-between"}>
        <Heading mb={8}> Comandas </Heading>
        <Flex minW={56} justifyContent={"space-between"}>
          <Select onChange={handleOpenedChange} maxW={36}>
            <option value="true">Abertas</option>
            <option value="false">Fechadas</option>
          </Select>

          <CreateControl
            onCreateControl={setControlChanged}
            controlCreated={controlChanged}
          />
        </Flex>
      </Flex>
      <TableContainer>
        <Table>
          <TableCaption> Comandas </TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Cliente</Th>
              <Th>Garçom</Th>
              <Th isNumeric>Número</Th>
              <Th isNumeric>Ações...</Th>
            </Tr>
          </Thead>
          <Tbody>
            {controls.payload ? (
              controls.payload.content.map((control) => (
                <Tr key={control.idcontrol}>
                  <Td>{control.idcontrol}</Td>
                  <Td>{control.client}</Td>
                  <Td>{control.waiter}</Td>
                  <Td isNumeric>{control.controlnumber}</Td>
                  <Td isNumeric>
                    <Menu>
                      {control.isclosed ? (
                        <MenuButton isDisabled as={Button}>
                          Ações
                        </MenuButton>
                      ) : (
                        <MenuButton as={Button}>Ações</MenuButton>
                      )}
                      <MenuList>
                        <Link href={`controls/${control.idcontrol}`}>
                          <MenuItem>Editar</MenuItem>
                        </Link>
                        <MenuItem
                          onClick={() => {
                            handleDeleteControl(control.idcontrol);
                          }}
                        >
                          Fechar
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
