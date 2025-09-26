import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'quote',
    loadChildren: () =>
      import('@app/features/quote').then((m) => m.QUOTE_ROUTES),
  },
  {
    path: 'proposal',
    loadChildren: () =>
      import('@app/features/proposal').then((m) => m.PROPOSAL_ROUTES),
  },
  {
    path: '',
    redirectTo: 'quote',
    pathMatch: 'full',
  },
];
