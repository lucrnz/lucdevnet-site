#!/bin/bash
# SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
# SPDX-License-Identifier: AGPL-3.0-only

container() {
  if which docker >/dev/null 2>&1; then
    docker "$@"
  else
    podman "$@"
  fi
}

container build -t pdf-generator . && \
container run --rm --network host \
  -v $(pwd)/output:/app/output \
  -v $(pwd)/../../dist:/app/www \
  -v $(pwd)/config.json:/app/config.json pdf-generator
