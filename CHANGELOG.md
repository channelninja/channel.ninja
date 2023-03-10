# Changelog

## [1.4.4](https://github.com/channelninja/channel.ninja/compare/v1.4.3...v1.4.4) (2023-03-10)


### Bug Fixes

* fix duplicate http logs in production ([4e417f4](https://github.com/channelninja/channel.ninja/commit/4e417f476ea89b6b1cab4f4f5c5503c7c4968d29))
* fix FORCE_FETCH_GRAPH default value ([2c693d5](https://github.com/channelninja/channel.ninja/commit/2c693d59fc5664b077c2b63f9b8079eb7daa06a4))

## [1.4.3](https://github.com/channelninja/channel.ninja/compare/v1.4.2...v1.4.3) (2023-03-10)


### Bug Fixes

* try to fix memory leak ([70c96cc](https://github.com/channelninja/channel.ninja/commit/70c96cc91037093e0be8693192fce05f34195db5))

## [1.4.2](https://github.com/channelninja/channel.ninja/compare/v1.4.1...v1.4.2) (2023-03-10)


### Bug Fixes

* use same level format for http-print and normal pino logger ([4455380](https://github.com/channelninja/channel.ninja/commit/44553803d5325c1a4c817b38aa337b9cd0620b62))


### Reverts

* **deps:** bump pg from 8.9.0 to 8.10.0" ([a861157](https://github.com/channelninja/channel.ninja/commit/a86115782cac2fa06f5b9da3a5f37b515247892f))

## [1.4.1](https://github.com/channelninja/channel.ninja/compare/v1.4.0...v1.4.1) (2023-03-10)


### Bug Fixes

* remove stack trace from production error logs ([1f8187f](https://github.com/channelninja/channel.ninja/commit/1f8187f977d92196a2ba9148b1ef5ac2cafe0d4f))

## [1.4.0](https://github.com/channelninja/channel.ninja/compare/v1.3.0...v1.4.0) (2023-03-09)


### Features

* add pino logger ([f552ad5](https://github.com/channelninja/channel.ninja/commit/f552ad574104db5849c1eb11c351d7ac67e18ad9))

## [1.3.0](https://github.com/channelninja/channel.ninja/compare/v1.2.1...v1.3.0) (2023-03-07)


### Features

* subscribe to graph changes ([a8cd3ce](https://github.com/channelninja/channel.ninja/commit/a8cd3ce3c2c508fd80a642dd8e2df2eb19f08337))


### Bug Fixes

* update node instead of save if it already exists ([584f965](https://github.com/channelninja/channel.ninja/commit/584f9651847c2fbdfe3bc0b364351ed80f9a6350))

## [1.2.1](https://github.com/channelninja/channel.ninja/compare/v1.2.0...v1.2.1) (2023-03-06)


### Bug Fixes

* remove log ([279a3d3](https://github.com/channelninja/channel.ninja/commit/279a3d3b1b1483c8c6252cabafc090d56742814c))

## [1.2.0](https://github.com/channelninja/channel.ninja/compare/v1.1.3...v1.2.0) (2023-03-05)


### Features

* **web-ln:** add link to funding tx after opening a channel via WebLN ([022f885](https://github.com/channelninja/channel.ninja/commit/022f885b8688298a773c9d141456bcec3a9b552a))

## [1.1.3](https://github.com/channelninja/channel.ninja/compare/v1.1.2...v1.1.3) (2023-03-04)


### Bug Fixes

* **suggestions:** use env vars instead of constants for suggestion criteria ([59cad32](https://github.com/channelninja/channel.ninja/commit/59cad3233a50b7cfd318da219a383ae9b7826aa7))

## [1.1.2](https://github.com/channelninja/channel.ninja/compare/v1.1.1...v1.1.2) (2023-03-02)


### Bug Fixes

* dont show loading when nodes are shown ([cbd6b9f](https://github.com/channelninja/channel.ninja/commit/cbd6b9fe767e67bbb43d3ace9337ecc4acc57a4e))

## [1.1.1](https://github.com/channelninja/channel.ninja/compare/v1.1.0...v1.1.1) (2023-03-02)


### Bug Fixes

* add loading text while fetching suggestions ([3f1673d](https://github.com/channelninja/channel.ninja/commit/3f1673df39d52dc200b90a607bc2f162b238aff5))

## [1.1.0](https://github.com/channelninja/channel.ninja/compare/v1.0.0...v1.1.0) (2023-03-01)


### Features

* **database:** replaced sqlite with postgres ([71ef43b](https://github.com/channelninja/channel.ninja/commit/71ef43b8e1d2eb4952378b561ba3ad1bf78c58f8))


### Bug Fixes

* **database:** use ssl certificate for production ([d6b2523](https://github.com/channelninja/channel.ninja/commit/d6b2523a9715090e93ddc80114f5ef013f15b171))


### Performance Improvements

* only fetch new graph every 4 hours ([5a4fc16](https://github.com/channelninja/channel.ninja/commit/5a4fc1640419b270a3ff150f3f6b1ffd403f54a7))

## 1.0.0 (2023-02-18)


### Features

* automatically launch webln to pay invoice ([04b9237](https://github.com/channelninja/channel.ninja/commit/04b92376d8824fe167a0a34a8d89bdb6aa54ea74))
* get pubkey from extension ([7234933](https://github.com/channelninja/channel.ninja/commit/7234933171164a5441e4d74751aa4a5f52d9e124))
* pay invoice with webln ([50c9c82](https://github.com/channelninja/channel.ninja/commit/50c9c8256d4e65bb5899272b8aafc44f040c21c2))
* **web-ln:** use WebLN to open channels ([e185054](https://github.com/channelninja/channel.ninja/commit/e185054b3447045f32f1147d053776d0342d0dd2)), closes [#28](https://github.com/channelninja/channel.ninja/issues/28)


### Bug Fixes

* only request webln when button is clicked ([0988ed0](https://github.com/channelninja/channel.ninja/commit/0988ed02fb96757922f11f5b40ac3623a9e6a7c2))
* use correct webln package ([6b97c1a](https://github.com/channelninja/channel.ninja/commit/6b97c1abd0067f055fed36bdb522845acbc25533))
