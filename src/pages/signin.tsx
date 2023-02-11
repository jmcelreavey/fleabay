import { type NextPage } from "next";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

const Signin: NextPage = () => {
  const [error, setError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <Container>
      <form
        onSubmit={handleSubmit(async (data) => {
          setError(undefined);

          await signIn("credentials", {
            email: data.email as string,
            password: data.password as string,
            redirect: false,
          }).then((res) => {
            if (res?.error) {
              setError(res.error);
            } else {
              reset();
            }
          });
        })}
      >
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="Enter your email address"
              type="email"
              {...register("email", {
                required: "This is required.",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address.",
                },
              })}
            />
            {errors.email && (
              <FormErrorMessage>
                {errors.email.message?.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: "This is required.",
                min: {
                  value: 8,
                  message: "Password must be at least 8 characters.",
                },
              })}
            />
            {errors.password && (
              <FormErrorMessage>
                {errors.password.message?.toString()}
              </FormErrorMessage>
            )}
          </FormControl>

          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Sign in error.</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit">Sign in</Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Signin;
