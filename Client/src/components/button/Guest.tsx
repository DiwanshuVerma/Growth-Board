import { FaRegUserCircle } from "react-icons/fa"

type GuestLoginProps = {
  setGuestClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuestLogin = ({ setGuestClicked }: GuestLoginProps) => {
  return (
    <button
      onClick={() => setGuestClicked((clicked) => !clicked)}
      className="bg-[#18181891] min-w-56 border border-neutral-700 py-2 group text-sm sm:text-base px-2 sm:px-4 w-fit h-fit rounded-lg shadow cursor-pointer text-white flex items-center gap-1 sm:gap-2"
    >
      <FaRegUserCircle size={22} />
      Register as a Guest
    </button>
  );
};

export default GuestLogin;
