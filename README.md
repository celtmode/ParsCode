# ParsCode

English | [中文](README.zh.md)

ParsCode (`parscode`) is an open-source agent harness developed by the ParsCode team.

It is built on an **everything-is-a-plugin** architecture and powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Documentation: [https://parscode.io](https://parscode.io).

**Note**: The `dsh` command is deprecated. Use `parscode` for new installations.

## Developer preview

ParsCode is in _developer preview_ and iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

Review the [safety notice](SAFETY.md) before running the project.

## Run

### Run from `npm`

Install `Node.js`, then run:

```sh
npx @parscode/parscode web
```

The command starts the Web UI at `http://127.0.0.1:3080` by default and opens it in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

### Run from source

To run from a repository checkout:

```sh
git clone https://github.com/parscode/parscode
cd parscode
pnpm install
pnpm run build
pnpm parscode web
```

`pnpm run build` prepares the repository artifacts. `pnpm parscode web` uses those built artifacts without rebuilding.

## Community and support

- Submit feedback or bug reports through [ParsCode Discussions](https://github.com/parscode/parscode/discussions).
- Add the [`parscode-plugin`](https://github.com/topics/parscode-plugin) topic to your plugin repository for discoverability.
- Join [ParsCode Discord community](https://discord.gg/parscode).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md).

`pnpm run dev:web` builds, serves, and rebuilds client bundles on source edits in one terminal, and `make help` lists the matching Make targets for Web and Desktop; the guide's application commands section owns the full table.

For agents, follow [AGENTS.md](AGENTS.md).

## Citation

```bibtex
@misc{parscode2026,
  title={ParsCode: Everything is a Plugin},
  author={ParsCode Team},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/parscode/parscode}},
}
```

## License

[MIT](LICENSE)

Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).