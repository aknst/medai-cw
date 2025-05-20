import { EmptyState, VStack } from "@chakra-ui/react"
import { FaBan } from "react-icons/fa"

function Forbidden() {
  return (
    <EmptyState.Root h="full" p={4}>
      <EmptyState.Content h="full" alignItems="center" justifyContent="center">
        <EmptyState.Indicator>
          <FaBan size="3rem" color="gray" />
        </EmptyState.Indicator>
        <VStack gap={3} textAlign="center">
          <EmptyState.Title>Доступ запрещён</EmptyState.Title>
          <EmptyState.Description>
            У вас нет прав для просмотра этой страницы.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}

export default Forbidden
