import { useAppDispatch } from "@/app/hooks"
import { toggleLogoutForm } from "@/features/ui/uiSlice"

export const LogoutPopup = () => {
    const dispatch = useAppDispatch()

    const handleLogout = () => {
        localStorage.removeItem('user')
        dispatch(toggleLogoutForm())
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex justify-center items-center">
            <div className="bg-green-950/50 p-4 space-y-3 rounded-lg text-white border-green-900 relative animate-in fade-in-0 zoom-in-95">
                <p>Do you really want to Logout?</p>
                <div className="flex items-center gap-2 justify-center">
                    <button onClick={() => dispatch(toggleLogoutForm())} className="text-black bg-white cursor-pointer px-2 py-1 text-sm rounded">Cancel</button>
                    <button onClick={handleLogout} className="bg-red-700 cursor-pointer px-2 py-1 text-sm rounded">Yes, Please</button>
                </div>
            </div>
        </div>
    )
}