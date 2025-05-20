import {
  Card,
  Flex,
  VStack,
  Skeleton,
  SkeletonText,
  Separator,
  Box,
} from "@chakra-ui/react"

const PendingAppointmentCard = () => {
  return (
    <Card.Root
      boxShadow="md"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Card.Body>
        <VStack align="start" gap="2">
          <Flex
            gap="3"
            justifyContent="space-between"
            alignItems="center"
            w="full"
          >
            <Skeleton h="8" w="32" />
            <Skeleton h="6" w="20" rounded="full" />
          </Flex>

          {/* Пациент */}
          <Box w="full">
            <Flex gap="2" align="center" mb="2">
              <SkeletonText noOfLines={1} />
            </Flex>
            <Skeleton h="4" w="full" />
          </Box>

          {/* Жалобы */}
          <Box w="full">
            <Flex gap="2" align="center" mb="2">
              <SkeletonText noOfLines={1} w="80px" />
            </Flex>
            <Skeleton h="20" w="full" />
          </Box>

          <Separator />

          {/* Дата и кнопка */}
          <Flex
            gap="3"
            justifyContent="space-between"
            alignItems="center"
            w="full"
          >
            <Skeleton h="4" w="32" />
            <Skeleton h="8" w="20" />
          </Flex>
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}

export default PendingAppointmentCard
