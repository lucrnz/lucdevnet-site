// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import { useNavigate } from '@solidjs/router';
import { onMount } from 'solid-js';

export function createRedirectComponent(path: string) {
  return function Redirect() {
    const navigate = useNavigate();
    onMount(() => {
      navigate(path, {
        replace: true,
      });
    });
    return null;
  };
}
