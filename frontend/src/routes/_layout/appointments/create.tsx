import { AppointmentForm } from "@/components/Appointments/AppointmentForm"
import { Box, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/appointments/create")({
  component: () => (
    <Box maxW="full">
      <Heading size="lg" pt={12} mb={6}>
        Новый приём
      </Heading>
      <AppointmentForm mode="create" />
    </Box>
  ),
})
