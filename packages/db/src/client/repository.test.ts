import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  createConsultationRequestFromInput,
  createLeadFromInput,
  createPageEvent as buildPageEvent,
} from "@pmf/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readLocalStore, updateLocalStore } from "./local-store";
import {
  createLeadWithConsultationRequest,
  createPageEvent,
} from "./repository";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("local repository persistence", () => {
  let tempDir: string;
  const previousLocalDataFile = process.env.LOCAL_DATA_FILE;
  const previousDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pmf-db-"));
    process.env.LOCAL_DATA_FILE = path.join(tempDir, "local-data.json");
    delete process.env.DATABASE_URL;
  });

  afterEach(async () => {
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

  it("stores the lead and consultation request together in local mode", async () => {
    const lead = createLeadFromInput({
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "정수기 렌탈",
      message: "빠른 상담 희망",
      source: "consult_page",
      consent: true,
    });
    const consultationRequest = createConsultationRequestFromInput(
      {
        name: "홍길동",
        phone: "010-1234-5678",
        email: "hong@example.com",
        productInterest: "정수기 렌탈",
        consultationType: "call",
        preferredDate: "",
        rentalPeriod: "36개월",
        budgetRange: "월 3-5만원",
        notes: "평일 오후 연락 희망",
        consent: true,
      },
      lead.id,
    );

    await createLeadWithConsultationRequest(lead, consultationRequest);

    const store = await readLocalStore();

    expect(store.leads.some((item) => item.id === lead.id)).toBe(true);
    expect(
      store.consultationRequests.some(
        (item) => item.id === consultationRequest.id && item.leadId === lead.id,
      ),
    ).toBe(true);
  });

  it("serializes local store mutations so concurrent writes keep every update", async () => {
    const lead = createLeadFromInput({
      name: "김민수",
      phone: "010-1111-2222",
      email: "minsu@example.com",
      productInterest: "업무 자동화",
      message: "테스트",
      source: "landing_page",
      consent: true,
    });
    const pageEvent = buildPageEvent({
      eventName: "lead_form_submitted",
      path: "/",
      sessionId: "anon_test",
      properties: {
        source: "landing_page",
      },
    });

    await Promise.all([
      updateLocalStore(async (store) => {
        store.leads.unshift(lead);
        await wait(25);
      }),
      createPageEvent(pageEvent),
    ]);

    const store = await readLocalStore();

    expect(store.leads.some((item) => item.id === lead.id)).toBe(true);
    expect(store.pageEvents.some((item) => item.id === pageEvent.id)).toBe(true);
  });
});
