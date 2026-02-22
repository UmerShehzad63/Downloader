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

# Hugging Face requires UID 1000. In node:20-slim, the user 'node' already has UID 1000.
# We use root initially to install system-level tools.
USER root

# Install system dependencies (FFmpeg and Python for yt-dlp)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Link python3 to python and install yt-dlp
RUN ln -s /usr/bin/python3 /usr/bin/python
RUN python3 -m pip install --break-system-packages yt-dlp

# Set up the working directory inside the 'node' user's home
WORKDIR /home/node/app

# Create the downloads folder and ensure the 'node' user owns it
RUN mkdir -p tmp-downloads/.jobs && \
    chown -R node:node /home/node/app && \
    chmod -R 777 /home/node/app/tmp-downloads

# Switch to the existing 'node' user (UID 1000)
USER node

# Set environment variables required for Next.js standalone and Hugging Face
ENV HOME=/home/node \
    PATH=/home/node/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=7860 \
    HOSTNAME="0.0.0.0"

# Copy the standalone build from the builder stage with correct ownership
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Hugging Face Spaces listen on port 7860
EXPOSE 7860

# Start the Next.js server
CMD ["node", "server.js"]