import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
  getRedirectResult,
  type UserCredential,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Login from "../Login";

// https://firebase.google.com/docs/web/setup#available-libraries

// project overview > settings > general > Your apps
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

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
