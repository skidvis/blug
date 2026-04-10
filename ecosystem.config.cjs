module.exports = {
  apps: [
    {
      name: 'blug',
      script: './dist/server/entry.mjs',
      cwd: '/home/deploy/blug',
      env: {
        NODE_ENV: 'production',
        PORT: 4321,
        HOST: '127.0.0.1',
      },
      watch: false,
      max_restarts: 10,
      restart_delay: 2000,
    },
  ],
};
