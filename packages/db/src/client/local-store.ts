import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  mockConsultationRequests,
  mockExperiments,
  mockLeads,
  mockPageEvents,
  mockPayments,
  mockProducts,
  type ConsultationRequest,
  type Experiment,
  type Lead,
  type PageEvent,
  type Payment,
  type Product,
} from "@pmf/core";

export interface LocalDataStore {
  leads: Lead[];
  consultationRequests: ConsultationRequest[];
  products: Product[];
  experiments: Experiment[];
  pageEvents: PageEvent[];
  payments: Payment[];
}

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const repoRoot = path.resolve(packageRoot, "../..");

const defaultSeed = (): LocalDataStore => ({
  leads: mockLeads,
  consultationRequests: mockConsultationRequests,
  products: mockProducts,
  experiments: mockExperiments,
  pageEvents: mockPageEvents,
  payments: mockPayments,
});

let localStoreOperation = Promise.resolve();

export const resolveLocalDataFile = () => {
  const configuredPath = process.env.LOCAL_DATA_FILE;

  if (!configuredPath) {
    return path.resolve(packageRoot, "local-data.json");
  }

  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(repoRoot, configuredPath);
};

const readLocalStoreFile = async (): Promise<LocalDataStore> => {
  const target = resolveLocalDataFile();

  try {
    const raw = await fs.readFile(target, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalDataStore>;
    const seed = defaultSeed();

    return {
      leads: parsed.leads ?? seed.leads,
      consultationRequests: parsed.consultationRequests ?? seed.consultationRequests,
      products: parsed.products ?? seed.products,
      experiments: parsed.experiments ?? seed.experiments,
      pageEvents: parsed.pageEvents ?? seed.pageEvents,
      payments: parsed.payments ?? seed.payments,
    };
  } catch {
    const seed = defaultSeed();
    await writeLocalStoreFile(seed);
    return seed;
  }
};

const writeLocalStoreFile = async (data: LocalDataStore) => {
  const target = resolveLocalDataFile();

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), "utf8");
};

const queueLocalStoreOperation = async <T>(operation: () => Promise<T>) => {
  const task = localStoreOperation.then(operation, operation);
  localStoreOperation = task.then(
    () => undefined,
    () => undefined,
  );

  return task;
};

export const readLocalStore = async (): Promise<LocalDataStore> => {
  await localStoreOperation;
  return readLocalStoreFile();
};

export const writeLocalStore = async (data: LocalDataStore) =>
  queueLocalStoreOperation(async () => {
    await writeLocalStoreFile(data);
  });

export const updateLocalStore = async <T>(
  updater: (data: LocalDataStore) => Promise<T> | T,
): Promise<T> =>
  queueLocalStoreOperation(async () => {
    const store = await readLocalStoreFile();
    const result = await updater(store);
    await writeLocalStoreFile(store);
    return result;
  });

export const seedLocalStore = async () => {
  const seed = defaultSeed();
  await writeLocalStore(seed);
  return resolveLocalDataFile();
};
