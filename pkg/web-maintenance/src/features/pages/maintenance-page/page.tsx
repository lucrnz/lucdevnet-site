// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import { H1 } from '@/features/ui/header';
import { Link } from '@/features/ui/link';
import { Title } from '@solidjs/meta';
import { pageTitle } from '@/features/website-constants';

export function MaintenancePage() {
  return (
    <>
      <Title>{pageTitle('Temporary Maintenance')}</Title>
      <H1 class="mb-4">Temporary Maintenance</H1>

      <div class="flex flex-col gap-4 mb-4">
        <p>
          <span class="mr-2 text-2xl">{'🧑‍🔧'}</span>The website is currently under temporary
          maintenance.
        </p>
        <p>Please check back soon.</p>
      </div>

      <div class="flex flex-col gap-4">
        <Link class="max-w-fit" href="http://github.com">
          Go somewhere else
        </Link>
      </div>
    </>
  );
}
