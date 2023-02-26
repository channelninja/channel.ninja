# ---------------
# Install Dependencies
# ---------------
FROM node:18.14.2-alpine as deps

WORKDIR /app

# Install dependencies neccesary for node-gyp on node alpine
RUN apk add --update --no-cache \
  libc6-compat \
  python3 \
  make \
  g++

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn

# ---------------
# Build App
# ---------------
FROM deps as build

WORKDIR /app

# Set env variables
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

# Build the NestJS and CRA application
COPY . .

RUN yarn run build

# Remove non production necessary modules
# RUN npm prune --production

# ---------------
# Release App
# ---------------
FROM node:18.14.2-alpine as final

WORKDIR /app

# Set env variables
ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /app/package.json ./
COPY --from=build /app/client/package.json ./client/package.json
COPY --from=build /app/node_modules/ ./node_modules

# Copy NextJS files
COPY --from=build /app/client/build ./client/build

# Copy NestJS files
COPY --from=build /app/dist/ ./dist

EXPOSE 3001

CMD [ "node", "./dist/main.js" ]