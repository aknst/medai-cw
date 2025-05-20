import {
  Badge,
  Box,
  EmptyState,
  Flex,
  Heading,
  Spinner,
  Table,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { z } from "zod"

import { type UserPublic, UsersService } from "@/client"
import AddUser from "@/components/Admin/AddUser"
import { UserActionsMenu } from "@/components/Common/UserActionsMenu"
import PendingUsers from "@/components/Pending/PendingUsers"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination.tsx"
import useAuth from "@/hooks/useAuth"
import Forbidden from "@/components/Common/403"

const usersSearchSchema = z.object({
  page: z.number().catch(1),
})

const PER_PAGE = 5

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  }
}

export const Route = createFileRoute("/_layout/users")({
  component: function AdminRouteWrapper() {
    const { user: currentUser } = useAuth()

    if (currentUser === undefined) {
      return (
        <EmptyState.Root h="full" p={4}>
          <EmptyState.Content
            h="full"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </EmptyState.Content>
        </EmptyState.Root>
      )
    }

    const unauthorized =
      !currentUser ||
      (currentUser.role !== "doctor" && !currentUser.is_superuser)

    if (unauthorized) {
      return <Forbidden />
    }

    return <Admin />
  },
  validateSearch: (search) => usersSearchSchema.parse(search),
})

function UsersTable() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const navigate = useNavigate({ from: Route.fullPath })
  const { page } = Route.useSearch()

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page }),
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
  const users = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingUsers />
  }

  return (
    <>
      <Table.Root size={{ base: "sm", md: "md" }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="sm">ФИО</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Email</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Роль</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Дата рождения</Table.ColumnHeader>
            <Table.ColumnHeader w="sm">Действия</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users?.map((user) => (
            <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
              <Table.Cell color={!user.full_name ? "gray" : "inherit"}>
                {user.full_name || "N/A"}
                {currentUser?.id === user.id && (
                  <Badge ml="1" colorScheme="teal">
                    Вы
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell truncate maxW="sm">
                {user.email}
              </Table.Cell>
              <Table.Cell fontWeight={user.is_superuser ? "bold" : "normal"}>
                {user.role === "doctor"
                  ? "Врач"
                  : user.role === "patient"
                    ? "Пациент"
                    : "Пользователь"}
              </Table.Cell>
              <Table.Cell color={!user.birth_date ? "gray" : "inherit"}>
                {user.birth_date ?? "N/A"}
              </Table.Cell>
              <Table.Cell>
                <UserActionsMenu
                  user={user}
                  disabled={currentUser?.id === user.id}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Flex justifyContent="flex-end" mt={4}>
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </>
  )
}

function Admin() {
  return (
    <Box maxW="full">
      <Heading size="lg" pt={12}>
        Управление пользователями
      </Heading>

      <AddUser />
      <UsersTable />
    </Box>
  )
}
