declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      APP_FIREBASE_STORAGE_BUCKET: string
      ENV: "LOCAL" | "FIREBASE"
      STORAGE: "LOCAL" | "FIREBASE"
      FIREBASE_STORAGE_EMULATOR_HOST?: string
    }
  }
}

export {};
