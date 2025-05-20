import { Container, Heading, Text } from "@chakra-ui/react"

import DeleteConfirmation from "./DeleteConfirmation"

const DeleteAccount = () => {
  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        Удаление аккаунта
      </Heading>
      <Text>Безвозвратное удаление аккаунта и ваших данных</Text>
      <DeleteConfirmation />
    </Container>
  )
}
export default DeleteAccount
