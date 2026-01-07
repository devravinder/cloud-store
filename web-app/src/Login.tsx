import { useAuthentication } from "./hooks/useAuthentication";

export default function Login() {
  const { login } = useAuthentication();

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={login}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Google
      </button>
    </div>
  );
}
