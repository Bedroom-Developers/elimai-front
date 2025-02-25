FROM node:18-alpine

WORKDIR /app

COPY . .
COPY .yarn/releases/yarn-4.6.0.cjs .yarn/releases/
COPY .yarnrc.yml .

RUN yarn install --immutable && \
    yarn build

CMD ["yarn", "start"]
