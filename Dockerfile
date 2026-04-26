FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (skip postinstall so prisma generate
# doesn't run before schema.prisma is copied)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source (includes prisma/schema.prisma)
COPY . .

# Now generate Prisma client and build
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
