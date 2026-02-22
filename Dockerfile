# Stage 1: Build the Next.js application
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies for building
COPY package*.json ./
RUN npm install

# Copy source and build the app
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:20-slim AS runner

# Use root to install system-level tools
USER root

# Install system dependencies + dnsutils to fix networking
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    dnsutils \
    && rm -rf /var/lib/apt/lists/*

# Link python3 to python and install latest yt-dlp
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN python3 -m pip install --no-cache-dir -U yt-dlp

# Set up the working directory inside the 'node' user's home
WORKDIR /home/node/app

# Create the downloads folder and ensure correct permissions for UID 1000
RUN mkdir -p tmp-downloads/.jobs && \
    chown -R node:node /home/node/app && \
    chmod -R 777 /home/node/app/tmp-downloads

# Set environment variables for HF
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=7860 \
    HOSTNAME="0.0.0.0"

# Copy the standalone build with correct ownership
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Final switch to node user (existing UID 1000)
USER node

# Hugging Face Spaces listen on port 7860
EXPOSE 7860

# Start the application
CMD ["node", "server.js"]