import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User,
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

const provider = new GoogleAuthProvider();
initializeApp(firebaseConfig);
const auth = getAuth(app);

type AuthenticationContextType = {
  user: User | null;
  login: () => Promise<void>;
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

  console.log(auth.currentUser)
  

  useEffect(() => {

    const checkExistingSession=()=>{
    
      const currentUser = auth.currentUser
        setUser(currentUser)
    }



    checkExistingSession()
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {

      console.log(auth.currentUser, "-------onAuthStateChanged---------", currentUser)
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {

    signInWithRedirect(auth, provider)

    // const result = await signInWithPopup(auth, provider);

    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    // const user = result.user;

    // setUser(user);
  };

  const logout = () => {
    auth.signOut();
  };
  return (
    <AuthenticationContext.Provider value={{ user, login, logout }}>
      <div className="">{user ? children : <Login />}</div>
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
