import AddProjectButton from '@/components/Form/AddProjectButton';
import CreateCanvasModal from '@/components/Form/CreateCanvasModal';
import JoinCanvasModal from '@/components/Form/JoinCanvasModal';
import Header from '@/components/Navs/Header';
import ProjectGrid from '@/components/cards/ProjectGrid';
import { createFileRoute } from '@tanstack/react-router'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/ongoing-projects')({
  component: () => {
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openJoinModal, setOpenJoinModal] = useState(false)
     const currentUser = JSON.parse(localStorage.getItem("user") || "{}")

    useEffect(() => {
      !currentUser?.validUser && window.location.replace("/auth/sign-in")
      !currentUser?.validUser && toast.error("Login first to access this page")
    },[currentUser])

    
    const handleCloseCreateModal = (e:any) => {
        if (e.target.id === "parent") setOpenCreateModal(false)
    }
    const handleCloseJoinModal = (e:any) => {
        if (e.target.id === "parent") setOpenJoinModal(false)
    }
    

    return (
     <ThirdwebProvider activeChain={ChainId.Arbitrum}> {/* Arbitrum chain ID */}
    <div className="min-h-screen bg-gray-900 text-white  relative">
      <Header />
      <ProjectGrid />
        <AddProjectButton setOpenCreateModal={setOpenCreateModal} setOpenJoinModal={setOpenJoinModal} />
        {openCreateModal && <CreateCanvasModal handleCloseModal={handleCloseCreateModal}/>}
        {openJoinModal && <JoinCanvasModal handleCloseModal={handleCloseJoinModal}/>}
        </div>
      </ThirdwebProvider>
    )
  }



   
})
