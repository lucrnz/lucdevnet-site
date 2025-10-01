// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import { H1 } from '@/features/ui/header';
import { Link } from '@/features/ui/link';
import { Title } from '@solidjs/meta';
import { pageTitle } from '@/features/website-constants';

export function NotFoundPage() {
  return (
    <>
      <Title>{pageTitle('Not Found')}</Title>
      <H1 class="mb-4">Not Found</H1>
      <p class="mb-4">The page you are looking for does not exist.</p>
      <Link href="/">Go to home</Link>
    </>
  );
}
