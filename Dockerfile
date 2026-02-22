# Stage 1: Build the Next.js application
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:20-slim AS runner
USER root

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

# Link python3 to python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install yt-dlp using the bypass flag for Debian Bookworm
RUN python3 -m pip install --no-cache-dir -U yt-dlp --break-system-packages

WORKDIR /home/node/app
RUN mkdir -p tmp-downloads/.jobs && \
    chown -R node:node /home/node/app && \
    chmod -R 777 /home/node/app/tmp-downloads

USER node
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=7860 \
    HOSTNAME="0.0.0.0"

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

EXPOSE 7860
CMD ["node", "server.js"]