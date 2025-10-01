// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@/features/router';
import { GlobalLayout } from './features/global-layout';
import { MetaProvider } from '@solidjs/meta';

const wrapper = document.getElementById('root');

if (!wrapper) throw new Error('Wrapper div not found');

render(
  () => (
    <MetaProvider>
      <GlobalLayout>
        <Router />
      </GlobalLayout>
    </MetaProvider>
  ),
  wrapper,
);
