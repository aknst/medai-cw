import type { ApiError } from "./client"
import useCustomToast from "./hooks/useCustomToast"

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: "Недопустимый email",
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: "Недопустимое имя",
}

export const passwordRules = (isRequired = true) => {
  const rules: any = {
    minLength: {
      value: 8,
      message: "Пароль должен содержать не менее 8 символов",
    },
  }

  if (isRequired) {
    rules.required = "Требуется пароль"
  }

  return rules
}

export const confirmPasswordRules = (
  getValues: () => any,
  isRequired = true,
) => {
  const rules: any = {
    validate: (value: string) => {
      const password = getValues().password || getValues().new_password
      return value === password ? true : "Пароли не совпадают"
    },
  }

  if (isRequired) {
    rules.required = "Требуется подтверждение пароля"
  }

  return rules
}

export const handleError = (err: ApiError) => {
  const { showErrorToast } = useCustomToast()
  const errDetail = (err.body as any)?.detail
  let errorMessage = errDetail || "Something went wrong."
  if (Array.isArray(errDetail) && errDetail.length > 0) {
    errorMessage = errDetail[0].msg
  }
  showErrorToast(errorMessage)
}

export const birthDateRules = (isRequired = true) => {
  const rules: any = {
    pattern: {
      value: /^\d{4}\-\d{2}\-\d{2}$/,
      message: "Формат даты: YYYY-MM-DD",
    },
    validate: (value: string | null | undefined) => {
      if (!isRequired && (!value || value.trim() === "")) {
        return true
      }

      const isValidFormat = value && /^\d{4}\-\d{2}\-\d{2}$/.test(value)
      if (!isValidFormat) {
        return "Неверный формат даты"
      }

      const [day, month, year] = value.split(".")
      const parsedDate = new Date(`${year}-${month}-${day}`)

      if (parsedDate.toString() === "Invalid Date") {
        return "Неверная дата"
      }

      if (parsedDate > new Date()) {
        return "Дата рождения не может быть в будущем"
      }

      return true
    },
  }

  if (isRequired) {
    rules.required = "Требуется указать дату рождения"
  }

  return rules
}

export const formatDateTime = (dateString: string | Date): string => {
  const date = new Date(dateString)

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
