import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  ModalFooter,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from "@chakra-ui/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import { api } from "../../utils/api";

type FormValues = {
  email: string;
};

const CreateVoterModal = ({
  isOpen,
  onClose,
  electionId,
  refetch,
}: {
  electionId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => Promise<unknown>;
}) => {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const createVoterMutation = api.voter.createSingle.useMutation({
    onSuccess: async (data) => {
      await refetch();
      toast({
        title: `${data.email} added!`,
        description: "Successfully added voter",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    } else {
      createVoterMutation.reset();
    }
    // //eslint-disable-next-line
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await createVoterMutation.mutateAsync({
      electionId,
      email: data.email,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen || createVoterMutation.isLoading} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add voter</ModalHeader>
        <ModalCloseButton disabled={createVoterMutation.isLoading} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack>
              <FormControl
                isInvalid={!!errors.email}
                isRequired
                isDisabled={createVoterMutation.isLoading}
              >
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Enter voter's email"
                  type="text"
                  {...register("email", {
                    required: "This is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />

                {errors.email && (
                  <FormErrorMessage>
                    {errors.email.message?.toString()}
                  </FormErrorMessage>
                )}
              </FormControl>
              {createVoterMutation.error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {createVoterMutation.error.message}
                  </AlertDescription>
                </Alert>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={2}
              onClick={onClose}
              disabled={createVoterMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={createVoterMutation.isLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateVoterModal;