declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      APP_FIREBASE_STORAGE_BUCKET: string
      ENV: "LOCAL" | "FIREBASE"
    }
  }
}

export {};
