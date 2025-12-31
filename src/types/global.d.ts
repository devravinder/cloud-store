declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      FIREBASE_STORAGE_BUCKET: string
      ENV: "LOCAL" | "FIREBASE"
    }
  }
}

export {};
