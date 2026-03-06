/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_IDENTITY_BASE_URL: string
    readonly VITE_APP_IDENTITY_CLIENTID: string
    readonly VITE_APP_IDENTITY_REDIRECT_URI: string
    readonly VITE_APP_IDENTITY_SCOPE: string
    readonly VITE_APP_IDENTITY_TYPE: string
    readonly VITE_APP_IDENTITY_CLIENTSECRET: string
    readonly VITE_APP_IDENTITY_COOKIE: string
    readonly VITE_APP_SITE_TITLE: string
    readonly VITE_APP_SERVICE_URL: string
    readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
