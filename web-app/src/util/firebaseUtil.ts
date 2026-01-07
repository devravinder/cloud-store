import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

type WithAccessTokenCallback<T> = (options: {
  headers: Record<string, string>;
}) => Promise<T>;

export const withAccessToken = async <T>(
  callback: WithAccessTokenCallback<T>
) => {
  const user = auth.currentUser;
  let token: string | undefined = "";

  try {
    token = await user?.getIdToken();
    if (!token) {
      // throw new Error("Not authenticated");
      console.log("no token");
    }
  } catch (error) {
    console.log({ error });
    window.location.reload();
  }

  return callback({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
