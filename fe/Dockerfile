FROM node:24-alpine AS build

WORKDIR /app

ARG VITE_PLEDGE_FORM_URL
ARG VITE_LIVE_ALERT_CONSENT_TEXT
ARG VITE_LIVE_ALERT_CONSENT_VERSION
ENV VITE_PLEDGE_FORM_URL=${VITE_PLEDGE_FORM_URL}
ENV VITE_LIVE_ALERT_CONSENT_TEXT=${VITE_LIVE_ALERT_CONSENT_TEXT}
ENV VITE_LIVE_ALERT_CONSENT_VERSION=${VITE_LIVE_ALERT_CONSENT_VERSION}

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
