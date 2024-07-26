FROM node:lts
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest-9 --activate

# Install puppeteer dependencies
RUN apt-get update && apt-get install -y \
    libgtk-3-0 \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    fonts-noto-emoji \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pnpm install
ENTRYPOINT ["node", "index.mjs"]
