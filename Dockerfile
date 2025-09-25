# Stage 1: Build the Vite React app
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Inject runtime environment variables dynamically
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
