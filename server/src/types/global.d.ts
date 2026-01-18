declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      APP_FIREBASE_STORAGE_BUCKET: string

      
      APP_ENV: "LOCAL" | "FIREBASE"
      FILE_STORAGE: "LOCAL" | "FIREBASE"
      DB_STORAGE: "LOCAL" | "FIREBASE"



      FIREBASE_STORAGE_EMULATOR_HOST?: string
    }
  }

  interface AppFile {
    name: string
    mimeType: string
    size: number
    path: string
  }
}

export {};
