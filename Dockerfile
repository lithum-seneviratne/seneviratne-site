FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]