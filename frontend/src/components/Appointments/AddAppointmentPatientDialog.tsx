import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import { type AppointmentCreatePatient, AppointmentsService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog"
import { Field } from "../ui/field"
import { UserSearch } from "../Common/UserSearch"

const AddAppointmentPatientDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const {
    setValue,
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AppointmentCreatePatient>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      doctor_id: "",
      complaints: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: AppointmentCreatePatient) =>
      AppointmentsService.createAppointmentPatient({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Запись создана успешна.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
    },
  })

  const onSubmit: SubmitHandler<AppointmentCreatePatient> = (data) => {
    mutation.mutate(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button value="add-item" my={4}>
          <FaPlus fontSize="16px" />
          Новый приём
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Новый приём</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Заполните данные, чтобы создать заявление для приема. Заявление
              отобразится в личном кабинете врача
            </Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.doctor_id}
                errorText={errors.doctor_id?.message}
                label="Выберите врача"
              >
                <UserSearch
                  onSelect={(userId) => setValue("doctor_id", userId)}
                />
              </Field>

              <Field
                invalid={!!errors.complaints}
                errorText={errors.complaints?.message}
                label="Жалобы"
              >
                <Textarea
                  required
                  id="complaints"
                  {...register("complaints")}
                  placeholder="Напишите ваши жалобы..."
                />
              </Field>
            </VStack>
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
              type="submit"
              disabled={!isValid}
              loading={isSubmitting}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default AddAppointmentPatientDialog
