FROM node:22-alpine AS builder

WORKDIR '/app'

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
COPY . .

RUN npm run build

FROM nginx:stable-alpine

# Serve the app on port 5173
EXPOSE 5173 

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html