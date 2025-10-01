// SPDX-FileCopyrightText: 2025 Luciano Hillcoat <me@lucdev.net>
// SPDX-License-Identifier: AGPL-3.0-only

import { Route, Router as SolidRouter } from '@solidjs/router';
import { lazy } from 'solid-js';
import { createRedirectComponent } from './redirection-component/redirect';

const MaintenancePage = lazy(() =>
  import('@/features/pages/maintenance-page').then((m) => ({
    default: m.MaintenancePage,
  })),
);

const NotFoundPage = lazy(() =>
  import('@/features/pages/not-found-page').then((m) => ({
    default: m.NotFoundPage,
  })),
);

const RedirectToMaintenancePage = createRedirectComponent('/maintenance');

export function Router() {
  return (
    <SolidRouter>
      <Route path="/maintenance" component={MaintenancePage} />
      <Route path="/" component={RedirectToMaintenancePage} />
      <Route path="/404" component={NotFoundPage} />
      <Route path="/blog/*" component={RedirectToMaintenancePage} />
      <Route path="/read" component={RedirectToMaintenancePage} />
      <Route path="/resume" component={RedirectToMaintenancePage} />
      <Route path="/licensing-terms" component={RedirectToMaintenancePage} />
      <Route path="/*" component={createRedirectComponent('/404')} />
    </SolidRouter>
  );
}
