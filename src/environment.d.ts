declare global {
    namespace NodeJS {
        interface ProcessEnv {
            REACT_APP_X_RAPIDAPI_KEY: string;
        }
    }
}

export {}