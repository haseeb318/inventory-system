import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";
import { loadEnvFile } from "node:process";

loadEnvFile();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/**
 * Explicit model map.
 * No dynamic guessing. No casing bugs.
 */
const modelMap = {
  users: prisma.users,
  products: prisma.products,
  sales: prisma.sales,
  purchases: prisma.purchases,
  expenses: prisma.expenses,
  salesSummary: prisma.salesSummary,
  purchaseSummary: prisma.purchaseSummary,
  expenseSummary: prisma.expenseSummary,
  expenseByCategory: prisma.expenseByCategory,
} as const;

type DeleteManyModel = {
  deleteMany: (args?: Record<string, never>) => Promise<unknown>;
};

type CreateManyModel = {
  createMany: (args: {
    data: unknown[];
    skipDuplicates?: boolean;
  }) => Promise<unknown>;
};

/**
 * Delete in proper relational order (children first).
 */
async function deleteAllData() {
  const deleteOrder = [
    "expenseByCategory",
    "sales",
    "purchases",
    "salesSummary",
    "purchaseSummary",
    "expenseSummary",
    "expenses",
    "products",
    "users",
  ] as const;

  for (const modelName of deleteOrder) {
    const model = modelMap[modelName] as unknown as DeleteManyModel;
    await model.deleteMany({});
    console.log(`Cleared data from ${modelName}`);
  }
}

/**
 * Seed data using createMany (efficient).
 */
async function seedData() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "users.json",
    "products.json",
    "expenses.json",
    "expenseSummary.json",
    "expenseByCategory.json",
    "sales.json",
    "salesSummary.json",
    "purchases.json",
    "purchaseSummary.json",
  ];

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);

    if (!fs.existsSync(filePath)) {
      console.warn(`Skipping missing file: ${fileName}`);
      continue;
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(raw);

    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      console.warn(`No data found in ${fileName}, skipping.`);
      continue;
    }

    const modelKey = path.basename(
      fileName,
      path.extname(fileName),
    ) as keyof typeof modelMap;
    const model = modelMap[modelKey] as unknown as CreateManyModel;

    if (!model) {
      console.error(`No Prisma model matches file: ${fileName}`);
      continue;
    }

    await model.createMany({
      data: jsonData,
      skipDuplicates: true,
    });

    console.log(`Seeded ${modelKey} with ${jsonData.length} records.`);
  }
}

async function main() {
  await deleteAllData();
  await seedData();
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
