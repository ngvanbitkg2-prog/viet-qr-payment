module.exports = {
  apps: [{
    name: 'vietqr-backend',
    script: 'node_modules/ts-node/dist/bin.js',
    args: 'src/index.ts',
    cwd: __dirname,
    watch: ['src'],
    ignore_watch: ['node_modules'],
    env: {
      NODE_ENV: 'development'
    }
  }]
};
