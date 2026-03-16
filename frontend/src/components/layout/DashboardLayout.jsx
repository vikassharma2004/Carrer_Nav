import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar    from './Sidebar'
import TopNavbar  from './TopNavbar'

const pageVariants = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -6 },
}

export default function DashboardLayout() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-dash-bg overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 overflow-y-auto p-5 lg:p-6"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
