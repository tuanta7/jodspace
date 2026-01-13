FROM node:24-alpine AS builder

WORKDIR '/app'

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
COPY . .

RUN npm run build

FROM nginx:1.29.1-bookworm

# Serve the app on port 5173
EXPOSE 5173 

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html