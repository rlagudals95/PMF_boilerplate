import { seedLocalStore } from "../client/local-store";

const target = await seedLocalStore();

console.log(`Seeded local PMF data at ${target}`);
