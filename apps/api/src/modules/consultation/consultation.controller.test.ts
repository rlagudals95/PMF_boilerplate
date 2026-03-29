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

describe("ConsultationController", () => {
  let app: INestApplication;
  let tempDir: string;
  const previousLocalDataFile = process.env.LOCAL_DATA_FILE;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pmf-api-consult-"));
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

  it("stores the lead and consultation request together", async () => {
    const payload = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "고객 문의 자동화",
      consultationType: "call",
      preferredDate: "",
      rentalPeriod: "다음 분기",
      budgetRange: "월 10-30만원",
      notes: "평일 오후 연락 희망",
      consent: true,
    };

    const server = app.getHttpServer() as Server;
    const response = await request(server)
      .post("/consultations")
      .set("x-pmf-session-id", "anon_test")
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      ok: true,
      message: "상담 요청이 접수되었습니다. 선호한 방식으로 연락드릴게요.",
    });

    const store = await readLocalStore();
    const lead = store.leads.find((item) => item.phone === payload.phone);

    expect(lead).toBeDefined();
    expect(
      store.consultationRequests.some(
        (requestItem) =>
          requestItem.leadId === lead?.id &&
          requestItem.productInterest === payload.productInterest,
      ),
    ).toBe(true);
  });
});
