import React from "react";

import { Button, Flex, Heading } from "@chakra-ui/react";
import { SidebarButton } from "./SidebarButton";

import { CiCircleAlert } from "react-icons/ci";
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
            button={"Menu 1"}
            link={"/"}
            icon={<CiCircleAlert />}
          />
          <SidebarButton
            button={"Menu 2"}
            link={"/"}
            icon={<CiCircleAlert />}
          />
          <SidebarButton
            button={"Menu 3"}
            link={"/"}
            icon={<CiCircleAlert />}
          />
          <SidebarButton
            button={"Menu 4"}
            link={"/"}
            icon={<CiCircleAlert />}
          />
          <SidebarButton
            button={"Menu 5"}
            link={"/"}
            icon={<CiCircleAlert />}
          />
          <SidebarButton
            button={"Menu 6"}
            link={"/"}
            icon={<CiCircleAlert />}
          />
          <SidebarButton
            button={"Menu 7"}
            link={"/"}
            icon={<CiCircleAlert />}
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
