import { Flex, Heading, Link, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export const SidebarButton = (props) => {
  const gray = useColorModeValue("gray.100", "gray.600");

  return (
    <Link
      href={props.link}
      _hover={{
        bg: gray,
        sub: "none",
      }}
    >
      <Flex
        alignItems={"center"}
        padding={8}
        w={"100%"}
        h={8}
        borderBottom={"1px solid"}
        borderColor={"gray.300"}
      >
        <Heading as={"h3"} size={"lg"} marginRight={4}>
          {props.icon}
        </Heading>

        <Heading as="h3" size={"md"} fontWeight={"semibold"}>
          {props.button}
        </Heading>
      </Flex>
    </Link>
  );
};
