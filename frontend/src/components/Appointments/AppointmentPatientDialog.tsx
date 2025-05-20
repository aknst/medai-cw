import { Box, Button, Flex, Text, Textarea } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Field } from "../ui/field"
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

import {
  AppointmentsService,
  type ApiError,
  type AppointmentPublic,
  type AppointmentUpdate,
} from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

interface AppointmentPatientDialogProps {
  appointment: AppointmentPublic
}

type AppointmentForm = {
  complaints: string
  doctor_diagnosis: string
  doctor_recommendations: string
}

export const AppointmentPatientDialog = ({
  appointment,
}: AppointmentPatientDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<"view" | "edit">("view")
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const { register, handleSubmit, reset } = useForm<AppointmentForm>({
    defaultValues: {
      complaints: appointment.complaints ?? "",
      doctor_diagnosis: appointment.doctor_diagnosis ?? "",
      doctor_recommendations: appointment.doctor_recommendations ?? "",
    },
  })

  const canEdit = appointment.status === "pending"

  // Сброс формы при открытии/закрытии
  useEffect(() => {
    if (!isOpen) {
      setMode("view")
      reset()
    }
  }, [isOpen, reset])

  const updateMutation = useMutation({
    mutationFn: (data: AppointmentUpdate) =>
      AppointmentsService.updateAppointment({
        appointmentId: appointment.id,
        requestBody: data,
      }),
    onSuccess: () => {
      showSuccessToast("Изменения сохранены")
      queryClient.invalidateQueries({
        queryKey: ["appointment", appointment.id],
      })
      setMode("view")
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
  })

  const onSubmit = (data: AppointmentForm) => {
    updateMutation.mutate({
      complaints: data.complaints,
      doctor_diagnosis: data.doctor_diagnosis,
      doctor_recommendations: data.doctor_recommendations,
    })
  }

  const toggleEditMode = () => {
    if (mode === "view") {
      setMode("edit")
    } else {
      reset()
      setMode("view")
    }
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      open={isOpen}
      placement="center"
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button>Открыть</Button>
      </DialogTrigger>
      <DialogContent maxW="lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "Информация о приёме" : "Редактировать приём"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <Flex direction="column" gap={4}>
              {/* Информация о враче */}
              <Box>
                <Text fontWeight="medium">Врач:</Text>
                <Text>{appointment.doctor?.full_name || "N/A"}</Text>
              </Box>

              {/* Жалобы */}
              <Field label="Жалобы" required={canEdit && mode === "edit"}>
                <Textarea
                  {...register("complaints", {
                    required: "Жалобы обязательны",
                    disabled: !(canEdit && mode === "edit"),
                  })}
                  placeholder="Опишите ваши жалобы..."
                  disabled={!(canEdit && mode === "edit")}
                />
                {/* {mode === "edit" && (
                    <Field.ErrorText>
                      {canEdit
                        ? "Обязательное поле"
                        : "Редактирование запрещено"}
                    </Field.ErrorText>
                  )} */}
              </Field>

              {/* Диагноз врача */}
              <Box>
                <Text fontWeight="medium">Диагноз врача:</Text>
                <Text>{appointment.doctor_diagnosis || "Не указан"}</Text>
              </Box>

              {/* Рекомендации врача */}
              <Box>
                <Text fontWeight="medium">Рекомендации врача:</Text>
                <Text>
                  {appointment.doctor_recommendations || "Не указаны"}
                </Text>
              </Box>
            </Flex>
          </DialogBody>

          <DialogFooter
            gap={3}
            justifyContent={mode === "view" ? "flex-end" : "space-between"}
          >
            {mode === "view" && canEdit && (
              <Button onClick={toggleEditMode}>Редактировать</Button>
            )}

            {mode === "edit" && (
              <>
                <Button
                  variant="subtle"
                  colorPalette="gray"
                  onClick={toggleEditMode}
                >
                  Отмена
                </Button>
                <Button type="submit" colorPalette="green">
                  Сохранить
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
