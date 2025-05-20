import { Container, Heading, Stack } from "@chakra-ui/react"
import { useTheme } from "next-themes"

import { Radio, RadioGroup } from "@/components/ui/radio"

const Appearance = () => {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          Визуальные настройки сайта
        </Heading>

        <RadioGroup
          onValueChange={(e) => setTheme(e?.value ?? "system")}
          value={theme}
          colorPalette="teal"
        >
          <Stack>
            <Radio value="system">Системная тема</Radio>
            <Radio value="light">Светлая тема</Radio>
            <Radio value="dark">Тёмная тема</Radio>
          </Stack>
        </RadioGroup>
      </Container>
    </>
  )
}
export default Appearance
