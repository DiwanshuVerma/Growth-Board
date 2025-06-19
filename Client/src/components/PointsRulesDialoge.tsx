
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"

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

      <DialogContent className="bg-zinc-900 text-white border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-green-400">Points System</DialogTitle>
          <DialogDescription className="text-neutral-300">
            How you earn points by using the app:
          </DialogDescription>
        </DialogHeader>
        <ul className="text-sm space-y-2 mt-4 text-white">
          <li>✅ +1 point for creating a new habit</li>
          <li>✅ +2 points for checking off a habit</li>
          <li>🔥 +5 points for 3-day streak</li>
          <li>🔥 +15 points for 7-day streak</li>
          <li>🏆 +70 points for 30-day streak</li>
          <li>🔄 Points are removed if habit is unchecked or deleted</li>
        </ul>
        <div className="flex justify-end mt-4">
          <DialogTrigger asChild>
            <Button variant="secondary" className="text-xs px-4 py-1">Close</Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  )
}
