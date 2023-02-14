<p align="center">
  <a href="https://channel.ninja" target="blank"><img src="https://channel.ninja/logo192.png" width="100" alt="channel.ninja Logo" /></a>
</p>

# channel.ninja

<a href='https://channel.ninja'>channel.ninja</a> is a tool to recommend channel partners for your lightning node.

## Installation

```bash
$ yarn
```

## Environment variables

```bash
$ cp server/.env.example server/.env
$ cp client/.env.example client/.env
```

Create a macaroon with the necessary permissions:

```bash
$ lncli bakemacaroon \
address:write \
invoices:write \
invoices:read \
info:read \
--save_to=~/.lnd/data/chain/bitcoin/mainnet/channel-ninja.macaroon

$ base64 -i ~/.lnd/data/chain/bitcoin/mainnet/channel-ninja.macaroon
```

Add your base64 encoded `channel-ninja.macaroon` to `server/.env`.

Change the rest of the `.env` files according to your needs.

## Running the app

```bash
# development
$ yarn start:dev

# production mode
$ yarn build
$ yarn start:prod
```

## Contributing

Please use <a href='https://www.conventionalcommits.org/en/v1.0.0/'>Conventional Commits</a>. Commit messages will be linted and rejected if they don't follow the convention.

To help with commit messages use:

```bash
$ yarn commit
```
