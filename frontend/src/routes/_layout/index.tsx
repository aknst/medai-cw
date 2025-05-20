import { Box, Button, Heading } from "@chakra-ui/react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import AddAppointmentPatientDialog from "@/components/Appointments/AddAppointmentPatientDialog"
import { AppointmentList } from "@/components/Appointments/AppointmentList"
import { AppointmentsService } from "@/client"
import { z } from "zod"
import { useQuery } from "@tanstack/react-query"
import PendingAppointmentList from "@/components/Pending/PendingAppointmentList"
import useAuth from "@/hooks/useAuth"
import { FaPlus } from "react-icons/fa"

const itemsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const PER_PAGE = 6

function getAppointmentsQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      AppointmentsService.readAppointments({
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["appointments", { page }],
  }
}

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  validateSearch: (search) => itemsSearchSchema.parse(search),
})

function Dashboard() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { user: currentUser } = useAuth()

  const { data, isLoading } = useQuery({
    ...getAppointmentsQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const setPage = (page: number) => {
    navigate({
      search: (current: Record<string, unknown>) => ({
        ...current,
        page,
      }),
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      <Box maxW="full">
        <Heading size="lg" pt={12}>
          Приемы
          {currentUser?.role === "patient" ? (
            <AddAppointmentPatientDialog />
          ) : (
            <Button
              value="add-item"
              my={4}
              onClick={async () => {
                await navigate({
                  to: "/appointments/create",
                })
              }}
            >
              <FaPlus fontSize="16px" />
              Новый приём
            </Button>
          )}
        </Heading>
        {isLoading ? (
          <PendingAppointmentList />
        ) : data ? (
          <AppointmentList
            appointments={data}
            currentPage={page}
            onPageChange={setPage}
          />
        ) : null}
      </Box>
    </>
  )
}
