
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

export function PointsRulesDialog() {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Info size={16} className="hover:text-neutral-300 cursor-pointer" />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="bg-zinc-900 text-white text-sm rounded px-2 py-1 max-w-[200px]">
          Click to see points awarding rules
        </TooltipContent>
      </Tooltip>

      <DialogContent className="bg-[#194232fa] text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-green-400">Points System</DialogTitle>
          <DialogDescription className="text-neutral-300">
            How you earn points by using the app:
          </DialogDescription>
        </DialogHeader>
        <ul className="text-sm space-y-2 mt-4 text-white">
          <li>Create a new habit =<span className="text-green-500"> +1</span></li>
          <li>Check off a habit =<span className="text-green-500"> +2</span></li>
          <li>3-day streak =<span className="text-green-500"> +5 🔥</span></li>
          <li>7-day streak =<span className="text-green-500"> +15 🔥 </span></li>
          <li>30-day streak =<span className="text-green-500"> +70 🏆 </span></li>
          <li className="mt-4">NOTE: Streak points are awarded per habit streak</li>
        </ul>
      </DialogContent>
    </Dialog>
  )
}
