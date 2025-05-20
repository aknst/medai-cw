import {
  Box,
  Button,
  Card,
  EmptyState,
  Flex,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { useNavigate } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"

import {
  type ApiError,
  type AppointmentCreateDoctor,
  type AppointmentUpdate,
  AppointmentsService,
  InferenceService,
  type UserGender,
  UsersService,
} from "@/client"
import useCustomToast from "@/hooks/useCustomToast"
import { dateToAge, handleError } from "@/utils"
import { Field } from "../ui/field"
import { UserSearch } from "../Common/UserSearch"
import PendingAppointmentForm from "../Pending/PendingAppointmentForm"
import { FaExclamationTriangle } from "react-icons/fa"

interface AppointmentFormProps {
  id?: string
  mode: "view" | "edit" | "create"
}

interface AppointmentFormData {
  patient_id: string
  complaints: string
  nlpDiagnosis: string
  nlpRecommendations: string
  doctorDiagnosis: string
  doctorRecommendations: string
}

export const AppointmentForm = ({
  id,
  mode: initialMode,
}: AppointmentFormProps) => {
  const [mode, setMode] = useState(initialMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInferencing, setIsInferencing] = useState(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const {
    data: appointment,
    isLoading: isAppointmentLoading,
    error,
  } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => AppointmentsService.readAppointment({ appointmentId: id! }),
    enabled: mode !== "create",
    gcTime: 0,
    refetchOnWindowFocus: true,
  })

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<AppointmentFormData>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      patient_id: appointment?.patient_id || "",
      complaints: appointment?.complaints || "",
      nlpDiagnosis: appointment?.nlp_diagnosis || "",
      nlpRecommendations: appointment?.nlp_recommendations || "",
      doctorDiagnosis: appointment?.doctor_diagnosis || "",
      doctorRecommendations: appointment?.doctor_recommendations || "",
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: AppointmentCreateDoctor) =>
      AppointmentsService.createAppointmentDoctor({ requestBody: data }),
    onSuccess: (newAppointment) => {
      showSuccessToast("Приём успешно создан")
      navigate({
        to: "/appointments/$appointmentId",
        params: {
          appointmentId: newAppointment.id,
        },
      })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", { page: 1 }] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: AppointmentUpdate) =>
      AppointmentsService.updateAppointment({
        appointmentId: id!,
        requestBody: data,
      }),
    onSuccess: () => {
      showSuccessToast("Информация о приёме обновлена")
      queryClient.invalidateQueries({ queryKey: ["appointment", id] })
      setMode("view")
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", { page: 1 }] })
    },
  })

  const inferenceMutation = useMutation({
    mutationFn: async (data: {
      gender: UserGender
      age: number
      complaints: string
    }) => InferenceService.runInference({ requestBody: data }),
  })

  const onSubmit: SubmitHandler<AppointmentFormData> = async (data) => {
    setIsSubmitting(true)
    try {
      const emptyToNull = (value: string) =>
        value.trim() === "" ? null : value

      if (mode === "create") {
        const createData: AppointmentCreateDoctor = {
          patient_id: data.patient_id,
          complaints: emptyToNull(data.complaints),
          nlp_diagnosis: emptyToNull(data.nlpDiagnosis),
          nlp_recommendations: emptyToNull(data.nlpRecommendations),
          doctor_diagnosis: emptyToNull(data.doctorDiagnosis),
          doctor_recommendations: emptyToNull(data.doctorRecommendations),
        }

        await createMutation.mutateAsync(createData)
      } else if (mode === "edit") {
        const updateData: AppointmentUpdate = {
          complaints: emptyToNull(data.complaints),
          nlp_diagnosis: emptyToNull(data.nlpDiagnosis),
          nlp_recommendations: emptyToNull(data.nlpRecommendations),
          doctor_diagnosis: emptyToNull(data.doctorDiagnosis),
          doctor_recommendations: emptyToNull(data.doctorRecommendations),
        }

        await updateMutation.mutateAsync(updateData)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGetRecommendations = async () => {
    try {
      setIsInferencing(true)
      const patientId = getValues("patient_id")
      let gender = "male" as UserGender
      let age = 20

      if (patientId) {
        const patientData = await UsersService.readUserById({
          userId: patientId,
        })

        if (patientData) {
          gender = patientData.gender ?? gender
          age = patientData.birth_date ? dateToAge(patientData.birth_date) : age
        }
      }

      const complaints = getValues("complaints")

      const result = await inferenceMutation.mutateAsync({
        gender: gender,
        age: age,
        complaints: complaints || "нет описания",
      })

      setValue("nlpDiagnosis", result.diagnosis)
      setValue("nlpRecommendations", result.recommendations)

      showSuccessToast("Рекомендации получены")
    } catch (err: any) {
      handleError(err)
    } finally {
      setIsInferencing(false)
    }
  }

  const toggleEditMode = () => {
    if (mode === "view" && id) {
      setMode("edit")
    } else if (mode === "edit" && id) {
      reset()
      setMode("view")
    }
  }

  useEffect(() => {
    if (appointment && mode !== "create") {
      reset({
        patient_id: appointment?.patient_id ?? undefined,
        complaints: appointment?.complaints ?? undefined,
        nlpDiagnosis: appointment?.nlp_diagnosis ?? undefined,
        nlpRecommendations: appointment?.nlp_recommendations ?? undefined,
        doctorDiagnosis: appointment?.doctor_diagnosis ?? undefined,
        doctorRecommendations: appointment?.doctor_recommendations ?? undefined,
      })
    }
  }, [appointment, mode, reset])

  if (mode !== "create" && isAppointmentLoading) {
    return <PendingAppointmentForm />
  }

  if (error) {
    return (
      <EmptyState.Root h="full">
        <EmptyState.Content h="full">
          <EmptyState.Indicator>
            <FaExclamationTriangle />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Приём не найден</EmptyState.Title>
            <EmptyState.Description>
              Создайте новый, чтобы начать работу
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <Box maxW="6xl">
      <Card.Root borderWidth="1px" borderRadius="lg" boxShadow="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card.Body p={6}>
            <Flex direction={{ base: "column", md: "row" }} gap={4} h="full">
              <Box flex="1" display="flex" flexDirection="column" gap={2}>
                <Field
                  label="Пациент"
                  helperText={mode === "create" && "Укажите пациента"}
                >
                  {mode === "view" || mode === "edit" ? (
                    <Box>
                      <Text fontSize="md">
                        {appointment?.patient?.full_name || "N/A"}{" "}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {appointment?.patient?.birth_date
                          ? `Дата рождения: ${appointment.patient.birth_date}`
                          : "N/A"}
                      </Text>
                    </Box>
                  ) : (
                    <UserSearch
                      onSelect={(userId) => {
                        console.log(userId, mode)
                        setValue("patient_id", userId)
                      }}
                    />
                  )}
                </Field>

                <Box h="full">
                  <Field
                    required
                    label="Жалобы"
                    invalid={!!errors.complaints}
                    errorText={errors.complaints?.message || !!error}
                    helperText="Жалобы пациента на момент консультации."
                  >
                    <Textarea
                      id="complaints"
                      {...register("complaints", {
                        required: "Требуются жалобы",
                      })}
                      size="md"
                      placeholder="Опишите жалобы пациента..."
                      h="full"
                      minH="192px"
                      readOnly={mode === "view"}
                    />
                  </Field>

                  {mode !== "view" && (
                    <Button
                      mt={4}
                      w="full"
                      variant="outline"
                      loading={isInferencing}
                      onClick={handleGetRecommendations}
                      type="button"
                    >
                      Получить рекомендации
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Правая колонка */}
              <Box flex="1" display="flex" flexDirection="column" gap={2}>
                <Field
                  readOnly
                  label="NLP Диагноз"
                  helperText="Здесь отображается диагноз, автоматически сгенерированный NLP-системой."
                >
                  <Input
                    {...register("nlpDiagnosis")}
                    as="textarea"
                    size="md"
                    readOnly={mode === "view" || mode === "edit"}
                  />
                </Field>

                <Field
                  readOnly
                  label="NLP Рекомендации"
                  mt={4}
                  helperText="Здесь отображаются рекомендации по лечению, предложенные
                      системой NLP."
                >
                  <Textarea
                    {...register("nlpRecommendations")}
                    size="md"
                    autoresize
                    maxH="5lh"
                    readOnly={mode === "view" || mode === "edit"}
                  />
                </Field>

                <Field
                  required
                  label="Диагноз врача"
                  mt={4}
                  invalid={!!errors.doctorDiagnosis}
                  errorText={errors.doctorDiagnosis?.message || !!error}
                  helperText="Подтвердите диагноз на основе полученных данных"
                >
                  <Input
                    {...register("doctorDiagnosis", {
                      required: "Требуется диагноз врача",
                    })}
                    as="textarea"
                    size="md"
                    readOnly={mode === "view"}
                  />
                </Field>

                <Field
                  label="Рекомендации врача"
                  mt={4}
                  helperText="Укажите рекомендации для пациента, основанные на поставленном диагнозе"
                >
                  <Textarea
                    {...register("doctorRecommendations")}
                    as="textarea"
                    size="md"
                    readOnly={mode === "view"}
                  />
                </Field>
              </Box>
            </Flex>

            {/* Кнопки управления */}
            <Flex mt={6} gap={3} justify={mode === "view" ? "flex-end" : "end"}>
              {/* Режим просмотра */}
              {mode === "view" && (
                <Button onClick={toggleEditMode}>Редактировать</Button>
              )}

              {/* Режим создания */}
              {mode === "create" && (
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isDirty}
                >
                  Завершить приём
                </Button>
              )}

              {/* Режим редактирования */}
              {mode === "edit" && (
                <>
                  <Button
                    variant="subtle"
                    colorPalette="gray"
                    onClick={toggleEditMode}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!isDirty}
                  >
                    Сохранить
                  </Button>
                </>
              )}
            </Flex>
          </Card.Body>
        </form>
      </Card.Root>
    </Box>
  )
}
