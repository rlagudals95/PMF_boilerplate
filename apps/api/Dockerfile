FROM node:22-bookworm-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /workspace

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter api build
RUN pnpm --filter api --prod deploy --legacy /out

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=4000
ENV LOCAL_DATA_FILE=/tmp/pmf-api-local-data.json

WORKDIR /app

COPY --from=builder /out/ ./

EXPOSE 4000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch(`http://127.0.0.1:${process.env.PORT ?? 4000}/health`).then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["node", "dist/main.js"]
