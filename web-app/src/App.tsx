import DashBoard from "./DashBoard";
import {
  AuthenticationContextProvider,
  useAuthentication,
} from "./hooks/useAuthentication";
import Login from "./Login";

function AppContent() {
  const { user } = useAuthentication();
  return user ? <DashBoard /> : <Login />;
}

export default function App() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <AuthenticationContextProvider>
        <AppContent />
      </AuthenticationContextProvider>
    </main>
  );
}
