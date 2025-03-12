import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/Form/LoginForm'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react'
import { useEffect } from 'react'


export const Route = createFileRoute('/auth/sign-in')({
  component: () => {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

    useEffect(() => {
      currentUser?.validUser && window.location.replace("/")
    },[currentUser])

    return (
     <ThirdwebProvider activeChain={ChainId.Arbitrum}> {/* Arbitrum chain ID */}
        <LoginForm />
      </ThirdwebProvider>
    )
  },
})
