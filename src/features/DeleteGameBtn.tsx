"use client";
import { rDeleteGame } from "@/shared/api/games";
import { notificationErrors, notificationSuccess } from "@/shared/consts";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@/shared/notifications";
import { queryClient } from "@/shared/Providers";
import { Box, Button, Flex, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { DeleteIcon } from "lucide-react";

export const DeleteGameBtn = ({ id }: { id: number }) => {
  const { mutate: deleteData, isLoading } = useMutation({
    mutationKey: [`deleteData ${id}`],
    mutationFn: async () => {
      await rDeleteGame(id);
    },
    onSuccess: () => {
      showSuccessNotification(notificationSuccess.delete);
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
    onError: (e) => {
      console.log("Delete error :", e);
      showErrorNotification(notificationErrors.delete);
    },
  });
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title="Удалить">
        <Box>
          <Text mb={20} fz={"lg"}>
            Вы уверены , что хотите удалить матч?
          </Text>
          <Flex justify={"center"} align={"center"} gap={20}>
            <Button
              onClick={() => deleteData()}
              loading={isLoading}
              disabled={isLoading}
              color="red.6"
            >
              Да
            </Button>
            <Button variant="outline" color="slate.9" onClick={close}>
              Отмена
            </Button>
          </Flex>
        </Box>
      </Modal>
      <Button color="red.6" onClick={open}>
        <DeleteIcon />
      </Button>
    </>
  );
};
