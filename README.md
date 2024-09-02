# lucsite

Hey! This is my [website](https://lucdev.net) source code.
Currently, it is an [static generated site](https://www.cloudflare.com/learning/performance/static-site-generator/).

## Tools used

- [Astro](https://astro.build/) - Framework for building static websites using components and TypeScript.
- [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.js.org/) - JavaScript runtime and package manager.
- [Caddy](https://caddyserver.com/) - For local HTTPS support.

## Development

This will prepare all the resources and start a local server.

```bash
pnpm run dev
```

Then access the site using the URL `lucdev.localhost`

_Note_: Firefox users need to enable the flag `security.enterprise_roots.enabled` to `true` by accessing `about:config` in the URL bar.

_Windows + WSL users:_ What I do is install Caddy with [Scoop](https://scoop.sh/#/apps?q=caddy) and then run make a symbolic link from "C:\Users\<username>\scoop\shims\caddy.exe" to "/usr/bin/caddy" for this command to work.

## Disclaimer

I released the source code for transparency and to help other people create similar websites.

I keep my right to not give support/accept pull requests or give documentation.

## Copying

Read the [LICENSE](./LICENSE) file for more information.
