---
title: "Live compressing the Steam compat data to save space on the drive"
pubDate: "2023-01-10"
description: "Taking advantage of btrfs"
summary: "Learn how to compress your Steam compatiblity data and gain more free-space on your device."
coverImg: "/images/blog/steam-compatdata/steam-compatdata-hero.webp"
coverAlt: "Steam logo showing a compress icon"
tags: "linux, steam"
---

> 💡 Info: This article is for the GNU/Linux operative system, It might work on SteamOS, but I haven't tried since I do not own that device.
> This also assumes you have intermediate knowledge using the command line.

> **Disclaimer**: Please do back-ups before playing around your files and folders. I don't want you to lose your precious save files. Also [disable Steam cloud](https://duckduckgo.com/?q=disable+steam+cloud) until you check that everything works fine. I am not responsible for any file loss.

Playing games using Steam on GNU/Linux with Proton is great, but there is a small detail,
Wine needs to create a folder called [prefix](https://wiki.winehq.org/FAQ#Wineprefixes) that contains a bunch of libraries and usually emulates the Drive `C:/` found on the Windows operative system.

Steam creates a new prefix folder **for each game that you have installed**, this means it could take a lot of drive space that we could take advantage of.

An experiment I am doing is to create a [loop device](https://en.wikipedia.org/wiki/Loop_device) and formatting as btrfs with compression to mount it into that directory, so it takes less drive space on the long run.

This solution only applies for users of traditional file systems (like ext4), if you already use btrfs, you probably don't need this, only take in mind that enabling compression on that particular folder (compatdata) might help.

## How to accomplish this

> These commands are aimed at experienced users rather than novices, please double-check before copy-pasting!

> Make sure to **close Steam** before this!

If you aren't sure where your Steam Library is located, you can check by right-clicking on any game on Steam, going to Properties, the tab _Local files_, and clicking the button on the top right that says _Browse_.

Choose a size for the loop device, this depends on the number of games you have, every game takes from ~200MB to ~600MB at worst.

For calculating a size, I recommend multiplying the number of games you have (or think you will install, you can overestimate if you want) by 600M.

For example, I have 29 games, and I hope to install let's say 40 games.

So this will be 40 \* 600 = 24000M . Which is around **24GB**.

**Note:** the compressed size for each folder will be smaller, so you can tune in this "600" number down if you want to experiment a bit.

```
cd /mnt/games_drive/SteamLibrary # Go to your library folder
fallocate -l 24G compatdata.btrfs # Allocate space in drive
sudo mkfs.btrfs -L "steamcompat" compatdata.btrfs
```

Create a temporary folder to mount the filesystem

```
mkdir compat_temp
```

Mount the filesystem

For this you will need to [choose a compression level for zstd](https://duckduckgo.com/?q=zstd+compression+level+comparison), I am going with 5.

```
sudo mount -t btrfs -o loop,compress-force=zstd:5 compatdata.btrfs compat_temp
```

Take ownership of the root folder from the loop device

```
sudo chown $(id -u):$(id -g) compat_temp
```

Copy all the prefixes to the loop device

```
for d in steamapps/compatdata/*; do test -d "$d" && cp -av "$d" compat_temp/; done
```

Now we will rename the actual compatdata to have a backup (you can remove it later if it works!)

```
mv steamapps/compatdata steamapps/compatdata.backup
```

Create an empty folder to mount the loop-device in

```
mkdir steamapps/compatdata
```

Unmount the loop-device

```
sudo umount compat_temp
```

Edit /etc/fstab

For this you can open your favorite editor, to be friendly here will show nano.

```
sudo nano /etc/fstab
```

Add this at the end

**Make sure to replace the folder paths correctly and use your compression level**

```
# Steam compat data
/mnt/games_drive/SteamLibrary/compatdata.btrfs /mnt/games_drive/SteamLibrary/steamapps/compatdata btrfs defaults,loop,compress-force=zstd:5,x-gvfs-hide 0 0
```

Note: You can also use [systemd mounts](https://duckduckgo.com/?q=how+to+create+systemd+mount) instead of fstab.

Mount all and reload systemd daemon

```
sudo mount -a && sudo systemctl daemon-reload
```

# The results

Looking at the ext4 folder, for 29 games, there is around 8 GiB of files.

Checking current disk usage of the loop-device folder (thanks to Thunar, by right-clicking the compatdata), around 3.7 GiB used (15%).

I hope you find this information useful.

Take care
