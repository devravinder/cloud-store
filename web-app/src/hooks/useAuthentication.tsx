import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  type User,
  type UserCredential
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Login from "../Login";
import { auth, provider } from "../util/firebaseUtil";


type AuthenticationContextType = {
  user: User | null;
  token: string;
  loginWithRedirect: () => Promise<void>;
  loginWithPopup: () => Promise<void>;
  logout: () => void;
};

const AuthenticationContext = createContext<
  AuthenticationContextType | undefined
>(undefined);

export const AuthenticationContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");

  const handleAuthResult = (result: UserCredential) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    setToken(credential?.accessToken || "");

    setUser(result.user);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        console.log("onAuthStateChanged currentUser present");
        setUser(currentUser);
      } else {
        console.log("onAuthStateChanged currentUser not present");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRedirectSignIn = async () => {
    const result = await getRedirectResult(auth);
    if (result) handleAuthResult(result);
  };

  useEffect(() => {
    handleRedirectSignIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithRedirect = async () => {
    await signInWithRedirect(auth, provider);
  };

  const loginWithPopup = async () => {
    const result = await signInWithPopup(auth, provider);
    handleAuthResult(result);
  };

  const logout = () => {
    auth.signOut();
    setUser(null);
  };
  return (
    <AuthenticationContext.Provider
      value={{ user, token, loginWithRedirect, loginWithPopup, logout }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthentication must be used within an AuthenticationContextProvider"
    );
  }
  return context;
};

export const ProtectedComponet = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthentication();

  return user ? children : <Login />;
};
