import assert from "node:assert/strict";
import net from "node:net";

export const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const getAvailablePort = async () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("Unable to allocate a local port for API smoke test."));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(address.port);
      });
    });
  });

export const waitForApiHealth = async (
  url,
  { timeoutMs = 15_000, intervalMs = 250 } = {},
) => {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        lastError = new Error(`Health check returned ${response.status}.`);
      } else {
        return await response.json();
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(intervalMs);
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}.`);
};

export const assertApiHealthPayload = (payload, expectedDataMode) => {
  assert.equal(payload.status, "ok");

  if (expectedDataMode) {
    assert.equal(payload.dataMode, expectedDataMode);
  }

  assert.equal(typeof payload.service, "string");
  assert.equal(typeof payload.timestamp, "string");
  assert.equal(typeof payload.counts?.leads, "number");
  assert.equal(typeof payload.counts?.experiments, "number");
  assert.equal(typeof payload.counts?.payments, "number");
};
