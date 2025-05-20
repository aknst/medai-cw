import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  useDisclosure,
  Stack,
  Icon,
  Text,
} from "@chakra-ui/react"
import { Link as RouterLink } from "@tanstack/react-router"

import Logo from "/assets/images/logo.svg"
import UserMenu from "./UserMenu"
import { useColorModeValue } from "../ui/color-mode"

import { FaBars, FaTimes } from "react-icons/fa"
import { FiUserPlus, FiUsers } from "react-icons/fi"
import type { IconType } from "react-icons/lib"
import useAuth from "@/hooks/useAuth"

interface NavItem {
  icon: IconType
  title: string
  path: string
}

const NavLink = ({ link }: { link: NavItem }) => {
  const colorModeValue = useColorModeValue("gray.200", "gray.700")

  return (
    <RouterLink to={link.path} search={{}}>
      <Flex
        gap={2}
        px={4}
        py={2}
        _hover={{
          background: "gray.subtle",
          bg: colorModeValue,
        }}
        rounded="md"
        alignItems="center"
      >
        <Icon as={link.icon} alignSelf="center" />
        <Text ml={2}>{link.title}</Text>
      </Flex>
    </RouterLink>
  )
}

function Navbar() {
  const { user: currentUser } = useAuth()
  const navItems = [
    ...(currentUser?.is_superuser
      ? [
          {
            icon: FiUsers,
            title: "Управление пользователями",
            path: "/users",
          },
        ]
      : []),
    ...(currentUser?.role === "doctor"
      ? [
          {
            icon: FiUserPlus,
            title: "Управление пациентами",
            path: "/users",
          },
        ]
      : []),
  ]

  const { open: isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxWidth="1100px"
        margin="0 auto"
      >
        <IconButton
          size="md"
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </IconButton>
        <HStack gap={8} alignItems="center">
          <RouterLink to="/" search={{}}>
            <Image src={Logo} alt="Logo" height="30px" />
          </RouterLink>
          <HStack as="nav" gap={4} display={{ base: "none", md: "flex" }}>
            {navItems.map((link) => (
              <NavLink key={link.title} link={link} />
            ))}
          </HStack>
        </HStack>
        <UserMenu />
      </Flex>
      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" gap={2}>
            {navItems.map((link) => (
              <NavLink key={link.title} link={link} />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default Navbar
