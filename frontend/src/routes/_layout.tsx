import { Flex } from "@chakra-ui/react"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

import Navbar from "@/components/Common/Navbar"
import { isLoggedIn } from "@/hooks/useAuth"
import Footer from "@/components/Common/Footer"

export const Route = createFileRoute("/_layout")({
  component: Layout,
  beforeLoad: async () => {
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      })
    }
  },
})

function Layout() {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Flex flex="1" maxWidth="1100px" w="full" px={4} margin="0 auto" pb="6">
        <Flex flex="1" direction="column" overflowY="auto">
          <Outlet />
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  )
}

export default Layout
