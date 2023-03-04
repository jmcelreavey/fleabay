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
import { api } from "../../utils/api";
import { useEffect } from "react";
import type { Position } from "@prisma/client";

type FormValues = {
  name: string;
};

const EditPartylistModal = ({
  isOpen,
  onClose,
  position,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  position: Position;
  refetch: () => Promise<unknown>;
}) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const editPositionMutation = api.position.editSingle.useMutation({
    onSuccess: async (data) => {
      await refetch();
      toast({
        title: `${data.name} updated!`,
        description: "Successfully updated position",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    } else {
      editPositionMutation.reset();
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await editPositionMutation.mutateAsync({
      id: position.id,
      name: data.name,
    });
  };

  return (
    <Modal isOpen={isOpen || editPositionMutation.isLoading} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Position - {position.name}</ModalHeader>
        <ModalCloseButton disabled={editPositionMutation.isLoading} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Stack>
              <FormControl
                isInvalid={!!errors.name}
                isRequired
                isDisabled={editPositionMutation.isLoading}
              >
                <FormLabel>Position name</FormLabel>
                <Input
                  placeholder="Enter position name"
                  type="text"
                  {...register("name", {
                    required: "This is required.",
                    value: position.name,
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters long.",
                    },
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>
                    {errors.name.message?.toString()}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
            {editPositionMutation.error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {editPositionMutation.error.message}
                </AlertDescription>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={2}
              onClick={onClose}
              disabled={editPositionMutation.isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={editPositionMutation.isLoading}
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditPartylistModal;