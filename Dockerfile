FROM node:alpine3.19

WORKDIR /app

COPY package.json /app/

RUN npm install -g pnpm && \
    pnpm install

EXPOSE 3000

CMD ["pnpm", "dev"]