FROM node:16-alpine

WORKDIR /app

ENV NG_CLI_ANALYTICS=false

COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

COPY . .

EXPOSE 4200

CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]
