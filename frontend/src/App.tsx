import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Sidebar } from "@/components/Sidebar"
import { TodayView } from "@/pages/TodayView"
import { CreateHabit } from "@/pages/CreateHabit"
import { HabitDetail } from "@/pages/HabitDetail"
import { EditHabit } from "@/pages/EditHabit"
import { Analytics } from "@/pages/Analytics"
import { Toaster } from "@/components/ui/sonner"

function AppContent() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<TodayView />} />
              <Route path="/habits/new" element={<CreateHabit />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/habits/:id" element={<HabitDetail />} />
              <Route path="/habits/:id/edit" element={<EditHabit />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
      <Toaster />
    </BrowserRouter>
  )
}

export default App
