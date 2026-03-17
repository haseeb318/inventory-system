import { loadEnvFile } from "node:process";
import { defineConfig, env } from "prisma/config";

loadEnvFile();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
