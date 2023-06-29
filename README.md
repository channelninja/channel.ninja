<p align="center">
  <img src="https://raw.githubusercontent.com/channelninja/channel.ninja/main/client/public/logo192.png" width="100" alt="channel.ninja Logo" />
</p>

# channel.ninja

channel.ninja is a tool to recommend channel partners for your lightning node.

# channel.ninja is gone

I don't have the time and energy right now to keep maintaining this side project.
If you found it useful and run your own LND node, just clone it and run it yourself :)

## Installation

```bash
$ yarn
```

## Environment variables

```bash
$ cp .env.example .env
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

Add your base64 encoded `channel-ninja.macaroon` to `.env`.

Change the rest of the `.env` file according to your needs.

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
