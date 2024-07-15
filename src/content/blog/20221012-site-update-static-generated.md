---
title: "Site update: Static generated"
pubDate: "2022-10-12"
description: "Just a site update"
summary: "Article describing the updates on this website including going static-generated and changing hosting provider."
tags: "webdev"
---

As you might notice, this site got updated.

At first, it used to be a [Single-Page-App](https://en.wikipedia.org/wiki/Single-page_application), it was a great [learning experience](https://lucdev.net/blog/20220928-hello-world) but it was time to move on.

As almost every good thing in the world, it builds up on the shoulders of giants, I borrowed [Xe's Xess stylesheet](https://github.com/Xe/Xess).

I wrote [a script](https://github.com/lucrnz/site/blob/6a41fbb57b8009bc56a8cd8360de752078c716a7/_scripts/getXess.ts) that takes the stylesheet and appends it's license to the top as a header. I [toot xer](https://mas.to/web/@lucie/109111066446735090) the script and xe seemed to be fine with it.

I can safely say that this site can be visited from [command line interface browsers](https://wiki.archlinux.org/title/list_of_applications#Console) and it is free from bloated client-side code.

![My website as seen today in elinks](/images/blog/20221012-site-update-static-generated/lucdev_elinks.png)

## Hosting update

I used to host this site on [dLinux](https://discord-linux.com/), I am a moderator on that community and I know the owner was really chill with me hosting my site on his platform.

The platform lets you have free (or paid) docker containers running any Linux distro of your choice, and you get to command it from a Discord bot, or via SSH.

I was fine with it, but you can not run Docker inside a docker container, and I wanted more fine control over it.

I decided to rent a VPS service from Germany.

Setting up SSL was super easy with [Caddy reverse proxy](https://caddyserver.com/), everything else is handled by systemd and Docker containers.

## Commenting on read articles

Another activity I started doing, is [recommending articles](/read) from other blogs and adding my own take/comments about them.

This activity is refreshing, because it does not require the mental energy of writing a full article, I try to keep comments in the margin of 12 to 70 words length.

Anyway, that is all I have for today.

If you have any comment, please reach me out on Mastodon, I am fairly active there!

Take care.
