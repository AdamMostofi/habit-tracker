import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"
import { motion } from "motion/react"
import { Menu, Home, List, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Today", icon: Home },
  { to: "/habits", label: "All Habits", icon: List },
  { to: "/habits/new", label: "New Habit", icon: Plus },
]

export function Sidebar() {
  return (
    <>
      {/* Mobile: hamburger trigger — visible below lg */}
      <div className="fixed top-0 left-0 z-40 flex items-center p-4 lg:hidden">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            showCloseButton={false}
            className="data-[side=left]:w-64 bg-sidebar text-sidebar-foreground border-sidebar-border p-0"
          >
            <MobileNavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: static sidebar — visible lg+ */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:max-w-64 lg:h-screen lg:sticky lg:top-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <DesktopNavContent />
      </aside>
    </>
  )
}

function MobileNavContent() {
  return (
    <motion.div
      className="flex flex-col h-full p-4 pt-14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <nav className="flex-1 space-y-1">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 + index * 0.06, ease: "easeOut" }}
          >
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors",
                  isActive
                    ? "bg-sidebar-accent/20 text-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <div className="pb-4">
        <p className="text-[10px] font-mono text-sidebar-foreground/40 tracking-widest uppercase select-none">
          Habit Tracker
        </p>
      </div>
    </motion.div>
  )
}

function DesktopNavContent() {
  return (
    <>
      <div className="flex h-14 items-center px-6 border-b border-sidebar-border">
        <span className="text-[10px] font-mono text-sidebar-foreground/40 tracking-widest uppercase select-none">
          Navigation
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors",
                isActive
                  ? "bg-sidebar-accent/20 text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[10px] font-mono text-sidebar-foreground/40 tracking-widest uppercase select-none">
          Habit Tracker
        </p>
      </div>
    </>
  )
}
