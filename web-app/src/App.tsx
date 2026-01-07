import DashBoard from "./DashBoard";
import {
  AuthenticationContextProvider,
} from "./hooks/useAuthentication";

export default function App() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <AuthenticationContextProvider>
       <DashBoard />
      </AuthenticationContextProvider>
    </main>
  );
}
