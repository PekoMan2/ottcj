FROM node:24-alpine AS build

WORKDIR /app

ARG VITE_SITE_PHASE=pre
ARG VITE_EVENT_START_AT=2026-08-13T06:00:00+02:00
ARG VITE_PLEDGE_FORM_URL
ENV VITE_SITE_PHASE=${VITE_SITE_PHASE}
ENV VITE_EVENT_START_AT=${VITE_EVENT_START_AT}
ENV VITE_PLEDGE_FORM_URL=${VITE_PLEDGE_FORM_URL}

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
