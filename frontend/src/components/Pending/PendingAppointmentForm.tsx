import {
  Card,
  Flex,
  Grid,
  Box,
  Skeleton,
  SkeletonText,
  Heading,
  Text,
} from "@chakra-ui/react"

const PendingAppointmentForm = () => {
  return (
    <Box maxW="6xl">
      <Flex justify="space-between" align="center" mb={6}>
        <SkeletonText noOfLines={1} height="24px" width="200px">
          <Heading size="lg">Загрузка данных...</Heading>
        </SkeletonText>
      </Flex>

      <Card.Root borderWidth="1px" borderRadius="lg" boxShadow="md">
        <Card.Body p={6}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <Box>
              <SkeletonText noOfLines={1} mb={2}>
                <Text fontWeight="medium">Пациент</Text>
              </SkeletonText>
              <Skeleton h="40px" rounded="md" mb={4} />

              <SkeletonText noOfLines={1} mb={2}>
                <Text fontWeight="medium">Жалобы</Text>
              </SkeletonText>
              <Skeleton h="100px" rounded="md" mb={4} />

              <Flex gap={3} mt={4}>
                <Skeleton h="36px" w="full" rounded="md" />
              </Flex>
            </Box>

            <Box>
              <SkeletonText noOfLines={1} mb={2}>
                <Text fontWeight="medium">Пациент</Text>
              </SkeletonText>
              <Skeleton h="40px" rounded="md" mb={4} />
              <SkeletonText noOfLines={1} mb={2}>
                <Text fontWeight="medium">Жалобы</Text>
              </SkeletonText>
              <Skeleton h="100px" rounded="md" mb={4} />
              <SkeletonText noOfLines={1} mb={2}>
                <Text fontWeight="medium">Пациент</Text>
              </SkeletonText>
              <Skeleton h="40px" rounded="md" mb={4} />
              <SkeletonText noOfLines={1} mb={2}>
                <Text fontWeight="medium">Жалобы</Text>
              </SkeletonText>
              <Skeleton h="100px" rounded="md" mb={4} />
            </Box>
          </Grid>

          <Flex mt={6} gap={3} justify="flex-end">
            <Skeleton h="40px" w="140px" rounded="md" />
            <Skeleton h="40px" w="140px" rounded="md" />
          </Flex>
        </Card.Body>
      </Card.Root>
    </Box>
  )
}

export default PendingAppointmentForm
