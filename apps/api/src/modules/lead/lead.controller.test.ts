import { promises as fs } from "node:fs";
import type { Server } from "node:http";
import os from "node:os";
import path from "node:path";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { readLocalStore } from "@pmf/db";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { AppModule } from "../../app.module";

describe("LeadController", () => {
  let app: INestApplication;
  let tempDir: string;
  const previousLocalDataFile = process.env.LOCAL_DATA_FILE;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pmf-api-lead-"));
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

  it("stores a lead and returns a success response", async () => {
    const payload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "업무 자동화",
      message: "도입 상담 희망",
      source: "landing_page",
      consent: true,
    };

    const server = app.getHttpServer() as Server;
    const response = await request(server)
      .post("/leads")
      .set("x-pmf-session-id", "anon_test")
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      ok: true,
      message: "문의가 접수되었습니다. 빠르게 검토 후 연락드릴게요.",
    });

    const store = await readLocalStore();
    expect(
      store.leads.some(
        (lead) =>
          lead.name === payload.name &&
          lead.phone === payload.phone &&
          lead.source === payload.source,
      ),
    ).toBe(true);
  });
});
