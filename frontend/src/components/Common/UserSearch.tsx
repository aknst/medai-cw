"use client"

import {
  Box,
  Combobox,
  HStack,
  Portal,
  Span,
  Spinner,
  Stack,
  useListCollection,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { type UserPublic, UsersService } from "@/client"

interface UserSearchProps {
  onSelect?: (id: string) => void
}

const PER_PAGE = 10

function getUsersQueryOptions({ search }: { search: string }) {
  return {
    queryKey: ["users", { search }],
    queryFn: async () => {
      const resp = await UsersService.readUsers({
        skip: 0,
        limit: PER_PAGE,
        search,
      })
      return resp.data
    },
    cacheTime: 0,
  }
}

export const UserSearch = ({ onSelect }: UserSearchProps) => {
  const [inputValue, setInputValue] = useState("")
  const { data, isLoading, isError } = useQuery(
    getUsersQueryOptions({ search: inputValue }),
  )

  const { collection, set } = useListCollection<UserPublic>({
    initialItems: data || [],
    itemToString: (item) => item.email,
    itemToValue: (item) => item.id.toString(),
  })

  useEffect(() => {
    if (data) {
      set(data)
    }
  }, [data, set])

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => setInputValue(e.inputValue)}
      onValueChange={(e) => {
        if (e.value && onSelect) {
          onSelect(e.value[0])
        }
      }}
      positioning={{ sameWidth: true, placement: "bottom-start" }}
    >
      <Combobox.Control>
        <Combobox.Input placeholder="Поиск пользователя..." />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Box zIndex="popover">
            <Combobox.Content>
              {isLoading ? (
                <HStack p="2">
                  <Spinner size="xs" borderWidth="1px" />
                  <Span>Загрузка...</Span>
                </HStack>
              ) : isError ? (
                <Span p="2" color="fg.error">
                  Ошибка загрузки пользователей
                </Span>
              ) : collection.items.length === 0 ? (
                <Combobox.Empty>Пользователи не найдены</Combobox.Empty>
              ) : (
                collection.items.map((user) => (
                  <Combobox.Item key={user.id} item={user}>
                    <Stack gap={0}>
                      <Span textStyle="sm" fontWeight="medium">
                        {user.full_name}
                      </Span>
                      <Span textStyle="xs" color="fg.muted">
                        {user.email}
                      </Span>
                    </Stack>

                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))
              )}
            </Combobox.Content>
          </Box>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
