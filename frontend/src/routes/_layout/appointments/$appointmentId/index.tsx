import { AppointmentForm } from "@/components/Appointments/AppointmentForm"
import { Box, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/appointments/$appointmentId/")({
  component: AppointmentIndex,
})

function AppointmentIndex() {
  const { appointmentId } = Route.useParams()

  return (
    <Box maxW="full">
      <Heading size="lg" pt={12} mb={6}>
        {`Прием ${appointmentId}`}
      </Heading>
      <AppointmentForm id={appointmentId} mode="view" />
    </Box>
  )
}
