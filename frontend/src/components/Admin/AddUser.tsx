import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"

import { type UserCreate, UsersService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { birthDateRules, emailPattern, handleError } from "@/utils"
import {
  Button,
  DialogActionTrigger,
  DialogTitle,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Checkbox } from "../ui/checkbox"
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
import useAuth from "@/hooks/useAuth"
import { Select } from "../ui/select"

interface UserCreateForm extends UserCreate {
  confirm_password: string
}

const AddUser = () => {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuth()
  const { showSuccessToast } = useCustomToast()
  // const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<UserCreateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: true,
      gender: "male",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      showSuccessToast("Пользователь успешно добавлен.")
      reset()
      setIsOpen(false)
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const onSubmit: SubmitHandler<UserCreateForm> = async (data) => {
    await mutation.mutateAsync(data)
  }

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button value="add-user" my={4}>
          <FaPlus fontSize="16px" />
          Добавить пользователя
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Добавить пользователя</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text mb={4}>
              Заполните форму ниже, чтобы добавить нового пользователя в
              систему.
            </Text>
            <VStack gap={4}>
              <Field
                required
                invalid={!!errors.email}
                errorText={errors.email?.message}
                label="Email"
              >
                <Input
                  id="email"
                  {...register("email", {
                    required: "Требуется email",
                    pattern: emailPattern,
                  })}
                  placeholder="Email"
                  type="email"
                />
              </Field>

              <Field
                invalid={!!errors.full_name}
                errorText={errors.full_name?.message}
                label="ФИО"
              >
                <Input
                  id="name"
                  {...register("full_name")}
                  placeholder="ФИО"
                  type="text"
                />
              </Field>

              <HStack gap={4} w="full" alignItems="baseline">
                <Field
                  invalid={!!errors.role}
                  errorText={errors.role?.message}
                  label="Роль"
                >
                  <Select
                    placeholder="Выберите роль"
                    options={
                      currentUser?.is_superuser
                        ? [
                            { label: "Пациент", value: "patient" },
                            { label: "Врач", value: "doctor" },
                          ]
                        : currentUser?.role === "doctor"
                          ? [{ label: "Пациент", value: "patient" }]
                          : []
                    }
                    size="md"
                    width="full"
                    {...register("role")}
                  />
                </Field>
                <Field
                  invalid={!!errors.gender}
                  errorText={errors.gender?.message}
                  label="Пол"
                >
                  <Select
                    placeholder="Выберите пол"
                    options={[
                      { label: "Мужчина", value: "male" },
                      { label: "Женщина", value: "female" },
                    ]}
                    size="md"
                    width="full"
                    {...register("gender")}
                  />
                </Field>
              </HStack>

              <Field
                label="Дата рождения"
                invalid={!!errors.birth_date}
                errorText={errors.birth_date?.message}
              >
                <Input
                  id="birth_date"
                  type="text"
                  placeholder="Дата рождения"
                  {...register("birth_date", birthDateRules())}
                />
              </Field>

              <Field
                required
                invalid={!!errors.password}
                errorText={errors.password?.message}
                label="Пароль"
              >
                <Input
                  id="password"
                  {...register("password", {
                    required: "Требуется пароль",
                    minLength: {
                      value: 8,
                      message: "Пароль должен содержать не менее 8 символов",
                    },
                  })}
                  placeholder="Пароль"
                  type="password"
                />
              </Field>

              <Field
                required
                invalid={!!errors.confirm_password}
                errorText={errors.confirm_password?.message}
                label="Подтверждение пароля"
              >
                <Input
                  id="confirm_password"
                  {...register("confirm_password", {
                    required: "Пожалуйста, подтвердите пароль",
                    validate: (value) =>
                      value === getValues().password || "Пароли не совпадают",
                  })}
                  placeholder="Подтверждение пароля"
                  type="password"
                />
              </Field>
            </VStack>

            <Flex mt={4} direction="column" gap={4}>
              {currentUser?.is_superuser && (
                <Controller
                  control={control}
                  name="is_superuser"
                  render={({ field }) => (
                    <Field disabled={field.disabled} colorPalette="teal">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={({ checked }) =>
                          field.onChange(checked)
                        }
                      >
                        Является админом?
                      </Checkbox>
                    </Field>
                  )}
                />
              )}
              <Controller
                control={control}
                name="is_active"
                render={({ field }) => (
                  <Field disabled={field.disabled} colorPalette="teal">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={({ checked }) => field.onChange(checked)}
                    >
                      Активный?
                    </Checkbox>
                  </Field>
                )}
              />
            </Flex>
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

export default AddUser
