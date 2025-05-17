import { Box, Text, Flex } from "@chakra-ui/react"
import { useColorModeValue } from "../ui/color-mode"

function Footer() {
  const currentYear = new Date().getFullYear()
  const bgColor = useColorModeValue("gray.100", "gray.900")
  const textColor = useColorModeValue("gray.600", "gray.400")

  return (
    <Box as="footer" bg={bgColor} py={4} mt="auto">
      <Flex
        maxWidth="1100px"
        margin="0 auto"
        px={4}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color={textColor} fontSize="sm">
          © {currentYear} MedAI
        </Text>
        <Text color={textColor} fontSize="sm">
          РКСП КР
        </Text>
      </Flex>
    </Box>
  )
}

export default Footer
