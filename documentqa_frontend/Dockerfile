# Stage 1: Build the React App
FROM node:lts AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# Copy built files from the builder stage
COPY --from=builder /app/dist .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
