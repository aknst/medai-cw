import { AppointmentCard } from "./AppointmentCard"
import { Box, Grid, Flex, VStack, EmptyState } from "@chakra-ui/react"
import type { AppointmentsPublic } from "@/client"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"
import { PER_PAGE } from "@/routes/_layout/index"
import useAuth from "@/hooks/useAuth"
import { FaSearch } from "react-icons/fa"

interface AppointmentListProps {
  appointments: AppointmentsPublic
  onPageChange: (page: number) => void
  currentPage: number
}

export const AppointmentList = ({
  appointments,
  onPageChange,
  currentPage,
}: AppointmentListProps) => {
  const { user: currentUser } = useAuth()
  const { data, count } = appointments

  if (data.length === 0) {
    return (
      <EmptyState.Root h="full">
        <EmptyState.Content h="full">
          <EmptyState.Indicator>
            <FaSearch />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Приёмы не найдены</EmptyState.Title>
            <EmptyState.Description>
              Создайте новый, чтобы начать работу
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    )
  }

  return (
    <Box>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        {data.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            viewAs={
              currentUser?.is_superuser
                ? "superuser"
                : (currentUser?.role ?? "patient")
            }
          />
        ))}
      </Grid>

      {/* Пагинация */}
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          page={currentPage}
          onPageChange={({ page }) => onPageChange(page)}
        >
          <Flex gap={2}>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </Box>
  )
}
