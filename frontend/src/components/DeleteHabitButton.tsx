import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { habits } from "@/lib/api"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteHabitButtonProps {
  habitId: number
  habitName: string
  onDeleted: () => void
}

export function DeleteHabitButton({
  habitId,
  habitName,
  onDeleted,
}: DeleteHabitButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await habits.delete(habitId)
      toast.success(`"${habitName}" deleted`)
      setOpen(false)
      onDeleted()
    } catch {
      toast.error("Failed to delete habit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground opacity-0 transition-all duration-150 hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Delete ${habitName}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete habit</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-medium text-foreground">{habitName}</span>? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={loading} />}
          >
            Cancel
          </DialogClose>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
