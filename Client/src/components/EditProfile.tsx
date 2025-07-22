
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "./ui/input"
import { Edit } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { updateUser } from "@/app/auth"
import { Button } from "./ui/button"
import { useAppSelector } from "@/app/hooks"
import { useDispatch } from "react-redux"

export function EditProfile() {
    const dispatch = useDispatch()
    const user = useAppSelector(state => state.auth.user)

    const [username, setUsername] = useState("")
    const [avatar, setAvatar] = useState<File>()
    const [isSaving, setIsSaving] = useState(false)
    const [usernameError, setUsernameError] = useState(false)

    const closeRef = useRef<HTMLButtonElement | null>(null)

     if (!user) {
        return null
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username.trim().length === 0) {
            setUsernameError(true);
            return;
        }

        setIsSaving(true);
        const success = await updateUser({ username, avatar }, dispatch);
        setIsSaving(false)

        if(success) closeRef.current?.click()
    }

    useEffect(() => {
        setUsername(user.username || "");
    }, [user]);


    return (
        <Dialog>
            <form onSubmit={handleSave}>
                <DialogTrigger className="p-2 w-full hover:bg-green-700 cursor-pointer rounded flex items-center gap-2">
                    <Edit className='text-amber-500' size={18} />
                    <span>Edit</span>
                </DialogTrigger>

                <DialogContent onOpenAutoFocus={() => {
                    setUsername(user.username || "");
                    setAvatar(undefined);
                    setUsernameError(false);
                }} className="dark:bg-[#194232fa]">

                    <div className="">
                        <div className="mb-4 flex gap-2 items-center">
                            <img
                                src={avatar ? URL.createObjectURL(avatar) : user.avatar}
                                alt="avatar"
                                className="w-17 h-17 rounded-full object-cover" />

                            <label htmlFor="avatar" className="underline cursor-pointer">Upload</label>
                            <Input onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) setAvatar(file)
                            }} id="avatar" type="file" className="hidden" accept="image/*" />
                        </div>

                        <label htmlFor="username" className="text-sm">New Username</label>
                        <Input value={username} onChange={(e) => {
                            setUsername(e.target.value)
                            setUsernameError(false)
                        }}
                            id="username" type="text" placeholder="John Doe" />
                        {usernameError && <p className="text-xs text-red-400 ml-3">Username can't be empty</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button ref={closeRef} variant="outline">Cancel</Button>
                        </DialogClose>

                        {/* <DialogClose asChild> */}
                            <Button onClick={handleSave} disabled={isSaving} type="submit" className={isSaving ? 'cursor-not-allowed' : 'cursor-default'}>
                                {isSaving ? 'Saving...' : 'Save changes'}
                            </Button>
                        {/* </DialogClose> */}

                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
