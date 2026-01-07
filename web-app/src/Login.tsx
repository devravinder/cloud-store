import { useAuthentication } from "./hooks/useAuthentication";

export default function Login() {
  const { loginWithRedirect, loginWithPopup } = useAuthentication();

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col w-full sm:w-96 gap-4 items-center justify-center h-screen p-4 rounded-lg shadow bg-white">
      <button
        onClick={loginWithRedirect}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Google Redirect
      </button>

      <button
        onClick={loginWithPopup}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Google Popup
      </button>
    </div>
    </div>
  );
}
