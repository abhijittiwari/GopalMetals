module.exports = {
  apps: [
    {
      name: 'gopal-metals',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:./prisma/production.db',
        ENABLE_DB_SEED: 'true'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'file:./prisma/production.db',
        ENABLE_DB_SEED: 'true'
      }
    }
  ],
};
