import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAppDispatch } from "@/app/hooks";
import { toggleLoginForm } from "@/features/ui/uiSlice";
import { X, ArrowLeftIcon } from "lucide-react";
import Login from "./button/login";
import GuestLogin from "./button/Guest";
import { useState } from "react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { sendOtp, userLogin, verifyOtpAndRegister } from "@/app/auth";
import { loginAsGuest, loginAsUser } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"

export default function LoginPopUp({ hideGuestOption = false }: { hideGuestOption?: boolean }) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const guest = JSON.parse(localStorage.getItem("guest") || "null")
    const guestLoginButton = guest ? false : true

    const [guestClicked, setGuestClicked] = useState(false)
    const [emailFlow, setEmailFlow] = useState(false)
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [isRegistering, setIsRegistering] = useState(false);
    const [sendingOtpLoader, setSendingOtpLoader] = useState(false)
    const [registeringLoader, setRegisteringLoader] = useState(false)
    const [loginLoader, setLoginLoader] = useState(false)
    const [guestName, setGuestName] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [emailError, setEmailError] = useState<string>("")

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const handleGuestLogin = () => {
        if (guestName.length <= 1) return toast.error("Enter Atleast Two Characters")

        const seed = Date.now().toString() + Math.floor(Math.random() * 10000)
        const guestAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`

        localStorage.setItem("guest", JSON.stringify({ guestName, guestAvatar }))
        dispatch(loginAsGuest())
        navigate('/habits')
        handleClose()
    }

    const handleClose = () => {
        dispatch(toggleLoginForm());
    }

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleClose()
        }
    }

    const handleSendOtp = async () => {
        setSendingOtpLoader(true)
        if (email && password && username) {
            if (!isValidEmail(email)) {
                setEmailError("Enter a valid email address.")
                return
            }
            setEmailError("")

            try {
                await sendOtp({ email, password, username })
                    .then(() => {
                        setOtpSent(true)
                        setSendingOtpLoader(false)
                    })
            }
            catch{
                setSendingOtpLoader(false)
            }

        }
    }

    const handleEmailLogin = async () => {
        if (!isValidEmail(email)) {
            setEmailError("Enter a valid email address.")
            return
        }
        setEmailError("")

        if (email && password) {
            setLoginLoader(true)
            try {
                const res = await userLogin({ email, password })
                const { token, user } = res.data
                navigate('/habits')
                localStorage.setItem("user", JSON.stringify({ token, user }))
                localStorage.removeItem("guest")
                localStorage.removeItem("guestHabits")

                dispatch(loginAsUser({ token, user }))
                handleClose()
            } catch (err) {
                console.log("error while login: ", err)
            }
            finally {
                setLoginLoader(false)
            }
        }
        else toast.error("All inputs are required")
    }

    const handleTwitterLogin = () => {
        try {
            window.location.href = import.meta.env.VITE_TWITTER_API
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            setEmailError("Enter a valid email address.");
            return;
        }

        setRegisteringLoader(true);
        setEmailError("");

        try {
            const res = await verifyOtpAndRegister(otp);
            const { token, user } = res.data;

            localStorage.setItem("user", JSON.stringify({ token, user }));
            localStorage.removeItem("guest");
            localStorage.removeItem("guestHabits");

            dispatch(loginAsUser({ token, user }));
            navigate('/habits');
            handleClose();
        } catch (err) {
            console.error("Registration failed:", err);
            setEmailError("Registration failed. Please try again.");
        } finally {
            setRegisteringLoader(false);
        }
    };


    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex justify-center items-center"
        >
            <Card className="bg-green-950/60 text-white border-green-900 relative w-[90%] max-w-md animate-in fade-in-0 zoom-in-95">
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 text-gray-200 hover:text-red-500"
                >
                    <X size={22} />
                </button>

                {emailFlow && (
                    <button
                        onClick={() => {
                            setEmailFlow(false)
                            setOtpSent(false)
                            setIsRegistering(false)
                            setEmail("")
                            setUsername("")
                            setPassword("")
                            setOtp("")
                        }}
                        className="absolute top-2 left-2 text-gray-200 hover:text-gray-500"
                    >
                        <ArrowLeftIcon size={22} />
                    </button>
                )}

                <CardHeader className="text-2xl text-center">
                    <CardTitle>Welcome!</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 m-auto">
                    {!emailFlow && (
                        <>
                            <Login
                                label="Continue with Twitter"
                                type="transparent"
                                handle="Twitter"
                                onClick={handleTwitterLogin}
                            />
                            <Login
                                label="Continue with Email"
                                type="transparent"
                                handle="Email"
                                onClick={() => {
                                    setEmailFlow(true)
                                    setGuestClicked(false) // hide guest inputs
                                }}
                            />
                            {!guestClicked && !hideGuestOption && guestLoginButton && (
                                <GuestLogin setGuestClicked={setGuestClicked} />
                            )}

                        </>
                    )}

                    {!emailFlow && guestClicked && (
                        <div className="flex flex-col gap-2">
                            <Input
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Guest name..."
                                className="w-56 border-neutral-400"
                            />
                            <p className="text-red-500 text-[12px] font-semibold mb-2">
                                * Syncing is not available in Guest mode
                            </p>
                            <button
                                onClick={handleGuestLogin}
                                className="bg-green-800 py-2 rounded text-white hover:bg-green-700"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {emailFlow && (
                        <>
                            <div className="flex flex-col gap-3">

                                {isRegistering && (
                                    <Input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                    />
                                )}

                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (emailError) setEmailError(''); // clear error while typing
                                    }}
                                    placeholder="Enter your email"
                                    className={emailError ? 'border-red-500' : ''}
                                />
                                {emailError && (
                                    <p className="text-red-500 text-sm mt-[-6px] mb-2">{emailError}</p>
                                )}

                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={isRegistering ? "Set a password" : "Enter your password"}
                                        className="pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
                                    >
                                        {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                                    </button>
                                </div>

                                {!otpSent && !isRegistering && (
                                    <button
                                        disabled={loginLoader}
                                        onClick={handleEmailLogin}
                                        className={`py-2 rounded text-white ${loginLoader ? "bg-green-900 cursor-not-allowed" : "bg-green-800 hover:bg-green-700"}`}
                                    >
                                        {loginLoader ? "Loging in..." : "Login"}
                                    </button>
                                )}

                                {!otpSent && isRegistering && (
                                    <button
                                        disabled={sendingOtpLoader}
                                        onClick={handleSendOtp}
                                        className={`py-2 rounded text-white  ${!sendingOtpLoader ? 'bg-green-800 hover:bg-green-700' : 'bg-green-950 cursor-not-allowed'}`}
                                    >
                                        {sendingOtpLoader ? "Sending..." : "Send OTP"}
                                    </button>
                                )}

                                {otpSent && (
                                    <>
                                        <Input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP"
                                        />
                                        <button
                                            disabled={registeringLoader}
                                            onClick={handleRegister}
                                            className={`py-2 rounded text-white ${registeringLoader ? "bg-green-900 cursor-not-allowed" : "bg-green-800 hover:bg-green-700"}`}
                                        >
                                            {registeringLoader ? "Signing in..." : "Continue"}
                                        </button>
                                    </>
                                )}

                                {/* Toggle Login/Register */}
                                <p className="text-center text-sm text-gray-300 mt-2">
                                    {isRegistering ? (
                                        <>
                                            Already have an account?{" "}
                                            <button
                                                onClick={() => {
                                                    setIsRegistering(false);
                                                    setOtpSent(false);
                                                }}
                                                className="underline text-green-400"
                                            >
                                                Login
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            New here?{" "}
                                            <button
                                                onClick={() => {
                                                    setIsRegistering(true);
                                                    setOtpSent(false);
                                                }}
                                                className="underline text-green-400"
                                            >
                                                Register
                                            </button>
                                        </>
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
