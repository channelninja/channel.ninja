<p align="center">
  <a href="https://channel.ninja" target="blank"><img src="https://channel.ninja/logo192.png" width="100" alt="channel.ninja Logo" /></a>
</p>

# channel.ninja

channel.ninja is a tool to recommend channel partners for your lightning node.

## Installation

```bash
$ yarn
```

## Environment variables

```bash
$ cp server/.env.example server/.env
$ cp client/.env.example client/.env
```

Configure `.env` files according to your node and sqlite database.

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ yarn build
$ yarn start:prod
```
