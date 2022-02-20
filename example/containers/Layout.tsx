import { useContext, useEffect, useState } from 'react'
import SidebarContext, { SidebarProvider } from 'context/SidebarContext'
import Sidebar from 'example/components/Sidebar'
import Header from 'example/components/Header'
import Main from './Main'
import { useAuth } from 'hooks/auth'
import Loader from 'example/components/Loader/Loader'

interface ILayout{
  children: React.ReactNode
}

function Layout({ children }: ILayout) {
  const [showLoader, setShowLoaderState] = useState(true)

  const { user, loading, logout } = useAuth({ middleware: 'auth' })
  const { isSidebarOpen } = useContext(SidebarContext)

  useEffect(() => {
    if (!loading && user) {
      setShowLoaderState(false)
    }

    return () => {
      setShowLoaderState(true)
    }
  }, [loading, user])
  
  return showLoader
    ? <Loader />
    : <SidebarProvider>
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${isSidebarOpen && 'overflow-hidden'}`}
      >
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header user={user} logout={logout} />
        <Main>
          {children}
        </Main>
      </div>
    </div>
  </SidebarProvider>
}

export default Layout