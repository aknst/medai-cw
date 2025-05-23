import { Container, Flex, Image, Input, Text } from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiCalendar, FiLock, FiMail, FiUser } from "react-icons/fi"

import type { UserRegister } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import {
  birthDateRules,
  confirmPasswordRules,
  emailPattern,
  passwordRules,
} from "@/utils"
import Logo from "/assets/images/logo.svg"
import { Select } from "@/components/ui/select"

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
        search: {},
      })
    }
  },
})

interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

function SignUp() {
  const { signUpMutation } = useAuth()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      birth_date: "",
      gender: "male",
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data)
  }

  return (
    <>
      <Flex flexDir={{ base: "column", md: "row" }} justify="center" h="100vh">
        <Container
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          h="100vh"
          maxW="sm"
          alignItems="stretch"
          justifyContent="center"
          gap={4}
          centerContent
        >
          <Image
            src={Logo}
            alt="FastAPI logo"
            height="auto"
            maxW="2xs"
            alignSelf="center"
            mb={4}
          />

          <Field
            invalid={!!errors.full_name}
            errorText={errors.full_name?.message}
          >
            <InputGroup w="100%" startElement={<FiUser />}>
              <Input
                id="full_name"
                minLength={3}
                {...register("full_name", {
                  required: "Требуется полное имя",
                })}
                placeholder="ФИО"
                type="text"
              />
            </InputGroup>
          </Field>

          <Field invalid={!!errors.gender} errorText={errors.gender?.message}>
            <Select
              placeholder="Выберите пол"
              options={[
                { label: "♂  Мужчина", value: "male" },
                { label: "♀  Женщина", value: "female" },
              ]}
              size="md"
              width="full"
              {...register("gender")}
            />
          </Field>

          <Field
            invalid={!!errors.birth_date}
            errorText={errors.birth_date?.message}
          >
            <InputGroup w="100%" startElement={<FiCalendar />}>
              <Input
                id="birth_date"
                type="text"
                placeholder="Дата рождения"
                {...register("birth_date", birthDateRules())}
              />
            </InputGroup>
          </Field>

          <Field invalid={!!errors.email} errorText={errors.email?.message}>
            <InputGroup w="100%" startElement={<FiMail />}>
              <Input
                id="email"
                {...register("email", {
                  required: "Требуется почта",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
            </InputGroup>
          </Field>
          <PasswordInput
            type="password"
            startElement={<FiLock />}
            {...register("password", passwordRules())}
            placeholder="Пароль"
            errors={errors}
          />
          <PasswordInput
            type="confirm_password"
            startElement={<FiLock />}
            {...register("confirm_password", confirmPasswordRules(getValues))}
            placeholder="Подтверждение пароля"
            errors={errors}
          />
          <Button variant="solid" type="submit" loading={isSubmitting}>
            Зарегистрироваться
          </Button>
          <Text>
            Уже есть аккаунт?{" "}
            <RouterLink to="/login" className="main-link">
              Войти
            </RouterLink>
          </Text>
        </Container>
      </Flex>
    </>
  )
}

export default SignUp
