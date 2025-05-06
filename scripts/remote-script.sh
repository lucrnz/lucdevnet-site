#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
# SPDX-License-Identifier: AGPL-3.0-only
# Exit on any non-zero return code
set -e

# Determine container runtime
CONTAINER_RUNTIME=$(command -v podman || command -v docker) || { echo "Needs podman or docker!"; exit 1; }

ROOTDIR="$(dirname "$0")"

# Make sure we are in the script directory
cd $ROOTDIR

DESTDIR=$ROOTDIR/server
REPODIR=$ROOTDIR/repo

# Pull the contents to be up to date
git -C "$REPODIR" pull

# Stop service, rebuild container & start again
systemctl --user stop container@site
$CONTAINER_RUNTIME compose build --no-cache
systemctl --user start container@site
