FROM node:18

# Install system dependencies for canvas + fonts
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    fontconfig \
    && rm -rf /var/lib/apt/lists/*

# Set font config path
ENV FONTCONFIG_PATH=/etc/fonts

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

RUN npm install

# Copy rest of project
COPY . .

EXPOSE 3091

CMD ["npm", "run", "start"]