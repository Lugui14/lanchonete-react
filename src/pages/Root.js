import { Flex } from "@chakra-ui/react";
import { Sidebar } from "../components/SidebarComponents/Sidebar";
import { LoginForm } from "../components/Forms/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { isLoginValid } from "../store/reducers/logged";
import { Outlet } from "react-router-dom";

export const Root = () => {
  const isLogged = useSelector((state) => state.logged);
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = "LANCHONETE";
    dispatch(isLoginValid());
  }, [dispatch]);

  return (
    <>
      <Flex w={"100vw"} h={"100vh"}>
        {isLogged ? (
          <Flex>
            <Sidebar />
            <Flex
              w={"80vw"}
              h={"100vh"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Outlet />
            </Flex>
          </Flex>
        ) : (
          <LoginForm />
        )}
      </Flex>
    </>
  );
};
