// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import type { JSX } from 'solid-js';
import { Footer } from '@/features/footer';
import '@fontsource-variable/cabin/index.css';
import '@fontsource-variable/exo-2/index.css';
import './global-styles.css';

export function GlobalLayout({ children }: { children: JSX.Element }) {
  return (
    <main class="h-full w-full tracking-wider p-4 bg-gray-100 text-neutral-800 dark:bg-zinc-800 dark:text-neutral-300">
      <div class="contents sm:block sm:m-auto sm:max-w-[80ch] lg:max-w-[100ch]">
        {children}
        <div class="invisible mb-8" aria-hidden="true" />
        <Footer />
      </div>
    </main>
  );
}
