module.exports = {
  apps: [
    {
      name: "ct-next-progress",
      cwd: "F:/ct-next-progress",

      script: "./node_modules/next/dist/bin/next",
      args: "start",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
