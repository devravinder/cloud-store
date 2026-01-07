import DashBoard from "./DashBoard";
import {
  AuthenticationContextProvider,
  ProtectedComponet
} from "./hooks/useAuthentication";


export default function App() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <AuthenticationContextProvider>
        <ProtectedComponet>
          <DashBoard />
        </ProtectedComponet>
      </AuthenticationContextProvider>
    </main>
  );
}
