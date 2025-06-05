import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Data } from "@/lib/db/schema"
import { calculateImt } from "@/lib/logic/logic"

type ResultProps = {
  isOpen: boolean
  onClose: () => void
  data: Data
}

export function ResultDialog({ isOpen, onClose, data }: ResultProps) {
  const result = calculateImt(data)
  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            IMT Result
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full border border-primary rounded p-4 mt-4">
            <h3 className="capitalize">
              IMT for {data?.no_hp} : {result}
            </h3>
          </div>
          <div className="space-y-4">
            <p>Nama: {data?.name}</p>
            <p>No HP: {data?.no_hp}</p>
            <p>Tinggi Badan: {data?.tinggi_badan} cm</p>
            <p>Berat Badan: {data?.berat_badan} kg</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
