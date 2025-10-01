// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import { A } from '@solidjs/router';
import type { JSX } from 'solid-js';
import clsx from 'clsx';

export function Link({
  children,
  class: className,
  href,
}: Omit<JSX.IntrinsicElements['a'], 'href'> & { href: string }) {
  return (
    <A
      class={clsx(
        'text-orange-500 dark:text-orange-400 hover:text-orange-600 dark:hover:text-orange-300 hover:underline cursor-pointer',
        className,
      )}
      href={href}
    >
      {children}
    </A>
  );
}
