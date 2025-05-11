declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: string;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      EMAIL_FROM: string;
      CONTACT_FORM_RECIPIENTS: string;
    }
  }
} 