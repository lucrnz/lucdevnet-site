#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
# SPDX-License-Identifier: AGPL-3.0-only

# Exit on any non-zero rc
set -e

# Set variables
REMOTE_HOST=luxlibre
REMOTE_BASEDIR=/home/lucdev/infra/site
BUNDLE_DIR=$REMOTE_BASEDIR/server/dist
REBUILD_SCRIPT=$REMOTE_BASEDIR/rebuild.sh

if [ ! -d  "$PWD/dist" ]; then
  echo "Run the build script before this one"
  exit 1
fi

# Transfer bundle
rsync -avh dist/ "$REMOTE_HOST:$BUNDLE_DIR" --delete

# Run remote script
ssh $REMOTE_HOST "cd $REMOTE_BASEDIR && sh $REBUILD_SCRIPT"
