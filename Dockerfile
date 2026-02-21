# Start with Node.js image
FROM node:20-slim

# Install system dependencies: python3, pip, and ffmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set up link for python
RUN ln -s /usr/bin/python3 /usr/bin/python

# Install yt-dlp globally via pip
RUN python3 -m pip install --break-system-packages yt-dlp

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Create directory for downloads and job storage
RUN mkdir -p tmp-downloads/.jobs && chmod -R 777 tmp-downloads

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
