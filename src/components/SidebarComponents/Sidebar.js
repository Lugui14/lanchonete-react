import React from "react";

import { Button, Flex, Heading } from "@chakra-ui/react";
import { SidebarButton } from "./SidebarButton";

import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { MdFastfood } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineBell } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { signOut } from "../../store/reducers/logged";
import { logout } from "../../services/auth";

export const Sidebar = () => {
  const dispatch = useDispatch();

  return (
    <Flex
      flexDir={"column"}
      h={"100%"}
      w={"20%"}
      borderRight={"1px solid"}
      borderColor={"gray.300"}
      justifyContent={"space-between"}
    >
      <Flex flexDir={"column"}>
        <Flex
          alignItems={"center"}
          justifyContent={"center"}
          boxShadow={"md"}
          h={48}
          w={"100%"}
          bg={"gray.100"}
        >
          <Heading> LANCHONETE </Heading>
        </Flex>

        <Flex flexDir={"column"}>
          <SidebarButton
            button={"Comandas"}
            link={"/controls"}
            icon={<BsReverseLayoutTextSidebarReverse />}
          />
          <SidebarButton
            button={"Produtos"}
            link={"/products"}
            icon={<MdFastfood />}
          />
          <SidebarButton
            button={"Categorias"}
            link={"/categories"}
            icon={<BiCategoryAlt />}
          />
          <SidebarButton
            button={"Garçons"}
            link={"/waiters"}
            icon={<IoPersonOutline />}
          />
          <SidebarButton
            button={"Pedidos"}
            link={"/requests"}
            icon={<AiOutlineBell />}
          />
        </Flex>
      </Flex>

      <Button
        onClick={async () => {
          dispatch(signOut());
          await logout();
        }}
        w={"100%"}
        borderRadius={0}
        colorScheme="teal"
        h={16}
      >
        {" "}
        Logout{" "}
      </Button>
    </Flex>
  );
};
