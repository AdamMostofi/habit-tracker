import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { TodayView } from "@/pages/TodayView"
import { HabitsList } from "@/pages/HabitsList"
import { CreateHabit } from "@/pages/CreateHabit"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<TodayView />} />
            <Route path="/habits" element={<HabitsList />} />
            <Route path="/habits/new" element={<CreateHabit />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
