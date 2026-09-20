module.exports = {
  apps: [
    {
      name: "ct-next-progress",
      cwd: "/opt/chengtong-vision/ct-next-progress/",
      script: "pnpm",
      args: "start",
      env: {
         NODE_ENV: "production",
        PORT: 5173,
      },
    },
  ],
}