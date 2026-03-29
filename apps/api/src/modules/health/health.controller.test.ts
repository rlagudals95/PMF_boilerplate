import { promises as fs } from "node:fs";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../../app.module";

describe("HealthController", () => {
  let app: INestApplication;
  let tempDir: string;
  const previousLocalDataFile = process.env.LOCAL_DATA_FILE;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pmf-api-health-"));
    process.env.LOCAL_DATA_FILE = path.join(tempDir, "local-data.json");
    delete process.env.DATABASE_URL;

    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();

    if (previousLocalDataFile) {
      process.env.LOCAL_DATA_FILE = previousLocalDataFile;
    } else {
      delete process.env.LOCAL_DATA_FILE;
    }

    if (previousDatabaseUrl) {
      process.env.DATABASE_URL = previousDatabaseUrl;
    } else {
      delete process.env.DATABASE_URL;
    }

    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("returns status, data mode, and persisted counts", async () => {
    const server = app.getHttpServer() as Server;
    const response = await request(server).get("/health").expect(200);
    const body = response.body as {
      status: string;
      dataMode: string;
      counts: {
        leads: number;
        experiments: number;
        payments: number;
      };
    };

    expect(body.status).toBe("ok");
    expect(body.dataMode).toBe("local-json");
    expect(typeof body.counts.leads).toBe("number");
    expect(typeof body.counts.experiments).toBe("number");
    expect(typeof body.counts.payments).toBe("number");
  });
});
