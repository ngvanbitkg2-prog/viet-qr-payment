module.exports = {
  apps: [{
    name: 'vietqr-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'dev',
    cwd: __dirname,
    env: {
      NODE_ENV: 'development'
    }
  }]
};
