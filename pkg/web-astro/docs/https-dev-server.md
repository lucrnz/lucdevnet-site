# HTTPS local development server

This application makes use of Caddy for running an https reverse proxy.

```sh
pnpm dev
```

Then access the site using the URL `lucdev.localhost`

_Note_: Firefox users need to enable the flag `security.enterprise_roots.enabled` to `true` by accessing `about:config` in the URL bar.

_Windows + WSL users:_ What I do is install Caddy with [Scoop](https://scoop.sh/#/apps?q=caddy) and then run make a symbolic link from "C:\Users\<username>\scoop\shims\caddy.exe" to "/usr/bin/caddy" for this command to work.
