/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly SITE_URL: string;
  readonly ADMIN_USERNAME: string;
  readonly ADMIN_PASSWORD_HASH: string;
  readonly JWT_SECRET: string;
  readonly GIT_AUTHOR_NAME: string;
  readonly GIT_AUTHOR_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
