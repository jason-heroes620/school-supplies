/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ADMIN_API_URL: string;
    readonly VITE_RESTADMIN_KEY: string;

    readonly VITE_EGHL_SITE: string;
    readonly VITE_EGHL_MERCHANTPASS: string;
    readonly VITE_EGHL_MERCHANTID: string;
    readonly VITE_EGHL_CALLBACKURL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
