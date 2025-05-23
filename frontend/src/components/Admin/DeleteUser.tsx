import { Button, DialogTitle, Text } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FiTrash2 } from "react-icons/fi"

import { UsersService } from "@/client"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "@/components/ui/dialog"
import useCustomToast from "@/hooks/useCustomToast"

const DeleteUser = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()

  const deleteUser = async (id: string) => {
    await UsersService.deleteUser({ userId: id })
  }

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      showSuccessToast("Пользователь был успешно удален")
      setIsOpen(false)
    },
    onError: () => {
      showErrorToast("При удалении пользователя произошла ошибка")
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    },
  })

  const onSubmit = async () => {
    await mutation.mutateAsync(id)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      role="alertdialog"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" colorPalette="red">
          <FiTrash2 fontSize="16px" />
          Удалить
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Все данные, связанные с этим пользователем, также будут{" "}
              <strong>удалены безвозвратно.</strong> Вы уверены? Вы не сможете
              отменить это действие.
            </Text>
          </DialogBody>

          <DialogFooter gap={2}>
            <DialogActionTrigger asChild>
              <Button
                variant="subtle"
                colorPalette="gray"
                disabled={isSubmitting}
              >
                Отмена
              </Button>
            </DialogActionTrigger>
            <Button
              variant="solid"
              colorPalette="red"
              type="submit"
              loading={isSubmitting}
            >
              Удалить
            </Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </form>
      </DialogContent>
    </DialogRoot>
  )
}

export default DeleteUser
