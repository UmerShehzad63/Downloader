# Stage 1: Build the application
FROM node:20-slim AS builder
WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# Ensure your next.config.js has { output: 'standalone' }
RUN npm run build

# Stage 2: Production runner
FROM node:20-slim AS runner

# Hugging Face runs with UID 1000. We create a user to match.
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    NODE_ENV=production \
    PORT=7860 \
    HOSTNAME="0.0.0.0"

WORKDIR $HOME/app

# Switch to root to install system-level tools
USER root
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set up python link and install yt-dlp
RUN ln -s /usr/bin/python3 /usr/bin/python && \
    python3 -m pip install --break-system-packages yt-dlp

# Create directory for downloads and set ownership to 'user'
RUN mkdir -p $HOME/app/tmp-downloads/.jobs && \
    chown -R user:user $HOME/app && \
    chmod -R 777 $HOME/app/tmp-downloads

# Switch back to the non-root user
USER user

# Copy standalone build files from builder stage with correct ownership
COPY --from=builder --chown=user:user /app/.next/standalone ./
COPY --from=builder --chown=user:user /app/.next/static ./.next/static
COPY --from=builder --chown=user:user /app/public ./public

# Hugging Face Spaces default port
EXPOSE 7860

# Start the application using the standalone server.js
CMD ["node", "server.js"]