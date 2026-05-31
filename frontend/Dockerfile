FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
ENV NGINX_ENVSUBST_FILTER=PUBLIC_DOMAIN
COPY nginx.conf /opt/nginx/templates/http.conf.template
COPY nginx.https.conf /opt/nginx/templates/https.conf.template
COPY 10-select-nginx-config.sh /docker-entrypoint.d/10-select-nginx-config.sh
RUN chmod +x /docker-entrypoint.d/10-select-nginx-config.sh
EXPOSE 80 443
