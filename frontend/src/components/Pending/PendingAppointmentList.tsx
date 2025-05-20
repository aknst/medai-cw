import { Box, Grid, Flex, Skeleton } from "@chakra-ui/react"
import PendingAppointmentCard from "./PendingAppointmentCard"

interface PendingAppointmentListProps {
  count?: number
}

const PendingAppointmentList = ({ count = 3 }: PendingAppointmentListProps) => {
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
        {Array.from({ length: count }).map((_, index) => (
          <PendingAppointmentCard key={index} />
        ))}
      </Grid>

      <Flex justifyContent="flex-end" mt={4}>
        <Flex gap={2}>
          <Skeleton h="8" w="8" borderRadius="md" />
          <Skeleton h="8" w="8" borderRadius="md" />
          <Skeleton h="8" w="8" borderRadius="md" />
        </Flex>
      </Flex>
    </Box>
  )
}

export default PendingAppointmentList
