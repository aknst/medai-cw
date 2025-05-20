import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"

import { type ApiError, type UserUpdateMe, UsersService } from "@/client"
import useAuth from "@/hooks/useAuth"
import useCustomToast from "@/hooks/useCustomToast"
import { birthDateRules, emailPattern, handleError } from "@/utils"
import { Field } from "../ui/field"
import { Select } from "../ui/select"

const UserInformation = () => {
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()
  const [editMode, setEditMode] = useState(false)
  const { user: currentUser } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty, isValid },
  } = useForm<UserUpdateMe>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
      birth_date: currentUser?.birth_date,
      gender: currentUser?.gender,
    },
  })

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const mutation = useMutation({
    mutationFn: (data: UserUpdateMe) =>
      UsersService.updateUserMe({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Пользовательские данные обновлены.")
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries()
    },
  })

  const onSubmit: SubmitHandler<UserUpdateMe> = async (data) => {
    mutation.mutate(data)
  }

  const onCancel = () => {
    reset()
    toggleEditMode()
  }

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Данные профиля
        </Heading>
        <Box
          w={{ sm: "full", md: "sm" }}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Field label="ФИО">
            {editMode ? (
              <Input
                {...register("full_name", { maxLength: 30 })}
                type="text"
                size="md"
              />
            ) : (
              <Text
                fontSize="md"
                py={2}
                color={!currentUser?.full_name ? "gray" : "inherit"}
                truncate
                maxW="sm"
              >
                {currentUser?.full_name || "N/A"}
              </Text>
            )}
          </Field>
          <Field
            mt={4}
            label="Email"
            invalid={!!errors.email}
            errorText={errors.email?.message}
          >
            {editMode ? (
              <Input
                {...register("email", {
                  required: "Требуется email",
                  pattern: emailPattern,
                })}
                type="email"
                size="md"
              />
            ) : (
              <Text fontSize="md" py={2} truncate maxW="sm">
                {currentUser?.email}
              </Text>
            )}
          </Field>
          <Field
            mt={4}
            label="Дата рождения"
            invalid={!!errors.birth_date}
            errorText={errors.birth_date?.message}
          >
            {editMode ? (
              <Input {...register("birth_date", birthDateRules())} size="md" />
            ) : (
              <Text
                fontSize="md"
                py={2}
                color={!currentUser?.full_name ? "gray" : "inherit"}
                truncate
                maxW="sm"
              >
                {currentUser?.birth_date || "N/A"}
              </Text>
            )}
          </Field>

          <Field
            mt={4}
            label="Пол"
            invalid={!!errors.gender}
            errorText={errors.gender?.message}
          >
            {editMode ? (
              <Field
                invalid={!!errors.gender}
                errorText={errors.gender?.message}
              >
                <Select
                  placeholder="Выберите пол"
                  options={[
                    { label: "Мужчина", value: "male" },
                    { label: "Женщна", value: "female" },
                  ]}
                  size="md"
                  width="full"
                  {...register("gender")}
                />
              </Field>
            ) : (
              <Text
                fontSize="md"
                py={2}
                color={!currentUser?.full_name ? "gray" : "inherit"}
                truncate
                maxW="sm"
              >
                {currentUser?.gender === "male"
                  ? "Мужчина"
                  : currentUser?.gender === "female"
                    ? "Женщина"
                    : "N/A"}
              </Text>
            )}
          </Field>

          <Flex mt={4} gap={3}>
            <Button
              variant="solid"
              onClick={toggleEditMode}
              type={editMode ? "button" : "submit"}
              loading={editMode ? isSubmitting : false}
              disabled={
                editMode ? !isDirty || !getValues("email") || !isValid : false
              }
            >
              {editMode ? "Сохранить" : "Изменить"}
            </Button>
            {editMode && (
              <Button
                variant="subtle"
                colorPalette="gray"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
            )}
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default UserInformation
