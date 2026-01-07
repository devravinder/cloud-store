# Setup

## Node-ts (Express) Setup

1. Install dependencies

  ```bash
     tsc --init
     pnpm init
     pnpm  add -D tsx typescript @types/node @types/express
     pnpm add express cors
  ```

1. update package.json

   ```js
    "main": "dist/server.js",
    "type": "module",
    "scripts": {
    "build": "tsc -p tsconfig.json",
    "dev": "tsx --no-warnings --env-file=.env --watch src/server.ts",
    "start": "node --no-warnings --env-file=.env dist/server.js"
           },

   ```

2. Add Env (.env)

   ```bash
      PORT=3000
      FIREBASE_STORAGE_BUCKET=my-bucket
   ```

## Firebase Setup

1. Install Firebase Tools

    ```bash
     pnpm add -g firebase-tools

    ```

2. Create Firebase Project
   - [Firebase](https://console.firebase.google.com/u/1/project/_/overview?purchaseBillingPlan=no-cost)

3. Authenticate (if needed)
  
   ```bash
     firebase login
    ```

4. Init Firebase Functions

   ```bash
      firebase init functions
   ```

   - Choose
      - ts functions
      - npm No ( as we are using pnpm )
      - eslint No

5. Refer the generated functions folder & do the changes in the project
   - see: pacakge.json scripts, packages, main, files & engines
   - src/index.ts
   - tsconfig.json
   - refer [Docs](https://firebase.google.com/docs/hosting/frameworks/express)

6. Setup Storage

   ```bas
   firebase functions:config:set storage.bucket="your-project-id.appspot.com"
   ```

7. Run emulator to test locally

   ```bash
      firebase emulators:start
   ```

   ```bash
      firebase emulators:start --only functions # only functions
   ```

   ```bash
      firebase emulators:start --only functions:default  # only default codebase
        # we can have mmltiple codebases (projects)
   ```

 default region: us-central1

## Firebase Emulators Issue

1. don't use env variable names that are [reserved](https://firebase.google.com/docs/functions/config-env?gen=2nd#reserved-names)
