// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import clsx from 'clsx';
import type { JSX } from 'solid-js';

export function H1({ children, class: className, ...props }: JSX.IntrinsicElements['div']) {
  return (
    <h1 class={clsx('font-display text-4xl font-bold', className)} {...props}>
      {children}
    </h1>
  );
}
