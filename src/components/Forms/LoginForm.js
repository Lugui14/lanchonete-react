import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { login } from "../../services/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "../../store/reducers/logged";

export const LoginForm = () => {
  const [loginError, setLoginError] = useState(false);
  const dispatch = useDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onsubmit = async ({ email, password }) => {
    let res = await login({ login: email, password });

    if (res !== 403) {
      dispatch(signIn());
    } else {
      setLoginError(res);
    }
  };

  return (
    <Flex w={"100%"} h={"100%"} alignItems={"center"} justifyContent={"center"}>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
        w={"25%"}
        h={"50%"}
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <Box w={"100%"} mb={12}>
          <form onSubmit={handleSubmit(onsubmit)}>
            <Heading mb={4} as="h2" textAlign={"center"} fontSize={"1.5rem"}>
              {" "}
              Login{" "}
            </Heading>

            <FormControl
              w={"100%"}
              display={"flex"}
              flexDir={"column"}
              isInvalid={errors.name}
            >
              <FormLabel htmlFor="email"> Usuario </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Email cadastrado"
                {...register("email", {
                  required: "Esse campo é obrigatório",
                })}
                mb={4}
              />

              <FormLabel htmlFor="password"> Senha </FormLabel>
              <Input
                id="senha"
                type="password"
                placeholder="Senha da conta"
                {...register("password", {
                  required: "O campo senha não pode ser vazio",
                  minLength: {
                    value: 4,
                    message: "A senha deve ter mais que 4 caracteres",
                  },
                })}
              />

              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>

              <Button
                alignSelf={"center"}
                w={36}
                colorScheme="teal"
                mt={8}
                isLoading={isSubmitting}
                type="submit"
              >
                {" "}
                Entrar{" "}
              </Button>
            </FormControl>
          </form>
        </Box>

        {loginError && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription> Usuario ou senha incorretos </AlertDescription>
          </Alert>
        )}
      </Flex>
    </Flex>
  );
};
