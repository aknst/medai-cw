import type { AppointmentPublic, AppointmentStatus, UserRole } from "@/client"
import { formatDateTime } from "@/utils"
import {
  Box,
  Card,
  Heading,
  Text,
  Badge,
  Flex,
  VStack,
  Separator,
  Button,
} from "@chakra-ui/react"
import { useTheme } from "next-themes"
import { useState } from "react"
import { FaClipboard, FaUserMd, FaUser } from "react-icons/fa"
import { AppointmentPatientDialog } from "./AppointmentPatientDialog"
import { useNavigate } from "@tanstack/react-router"

const statusConfig: Record<
  AppointmentStatus,
  { label: string; colorPalette: string }
> = {
  pending: { label: "В ожидании", colorPalette: "yellow" },
  completed: { label: "Принят", colorPalette: "green" },
  cancelled: { label: "Отклонен", colorPalette: "red" },
}

type ExtendedUserRole = UserRole | "superuser"

interface AppointmentCardProps {
  appointment: AppointmentPublic
  viewAs: ExtendedUserRole
}

export const AppointmentCard = ({
  appointment,
  viewAs,
}: AppointmentCardProps) => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [status, _] = useState<AppointmentStatus>(
    appointment.status as AppointmentStatus,
  )
  const { label: statusLabel, colorPalette } = statusConfig[status]

  const onOpen = async () => {
    navigate({
      to: "/appointments/$appointmentId",
      params: {
        appointmentId: appointment.id,
      },
    })
    return true
  }

  return (
    <Card.Root
      boxShadow="md"
      borderRadius="lg"
      bg={theme === "dark" ? "gray.800" : "white"}
      borderWidth="1px"
      borderColor={theme === "dark" ? "gray.700" : "gray.200"}
    >
      <Card.Body>
        <VStack align="start" gap="2">
          <Flex w="full" justify="space-between" align="start">
            <VStack align="start" gap="1">
              <Flex gap="2" align="center">
                <FaUserMd />
                <Heading size="md">{"Врач:"}</Heading>
              </Flex>

              <Text color={theme === "dark" ? "gray.300" : "gray.600"}>
                {appointment.doctor?.full_name || "N/A"}
              </Text>
            </VStack>

            {/* Статус приёма */}
            <Badge
              colorPalette={colorPalette}
              px="3"
              py="1"
              borderRadius="full"
            >
              {statusLabel}
            </Badge>
          </Flex>
          <Box>
            <Flex gap="2" align="center" mb="2">
              <FaUser />
              <Heading size="md">{"Пациент:"}</Heading>
            </Flex>
            <Text color={theme === "dark" ? "gray.300" : "gray.600"}>
              {appointment.patient?.full_name ??
                (appointment.patient_id !== null
                  ? `ID: ${appointment.patient_id}`
                  : "N/A")}
            </Text>
          </Box>
          <Box>
            <Flex gap="2" align="center" mb="2">
              <FaClipboard />
              <Heading size="md">{"Жалобы:"}</Heading>
            </Flex>
            <Text color={theme === "dark" ? "gray.300" : "gray.600"}>
              {appointment.complaints || "Не указаны"}
            </Text>
          </Box>

          <Separator />

          <Flex
            gap="3"
            justifyContent="space-between"
            alignItems="center"
            w="full"
          >
            <Text color={theme === "dark" ? "gray.300" : "gray.600"}>
              {formatDateTime(appointment.updated_at)}
            </Text>
            {viewAs === "patient" ? (
              <AppointmentPatientDialog appointment={appointment} />
            ) : (
              <Button size="sm" onClick={onOpen}>
                Открыть
              </Button>
            )}
          </Flex>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
