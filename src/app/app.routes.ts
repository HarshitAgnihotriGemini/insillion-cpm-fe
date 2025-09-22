import { Routes } from '@angular/router';
import { CpmComponent } from './cpm/cpm.component';
import { CpmReviewDetailsComponent } from './cpm-review-details/cpm-review-details.component';
import { CpmProposalComponent } from './cpm-proposal/cpm-proposal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cpm', pathMatch: 'full' },
  { path: 'cpm', component: CpmComponent },
  { path: 'cpm-review', component: CpmReviewDetailsComponent },
  { path: 'cpm-proposal', component: CpmProposalComponent },
];
