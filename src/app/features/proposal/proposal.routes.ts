import { Routes } from '@angular/router';
import { CreateProposalComponent } from './components/create-proposal/create-proposal.component';

export const PROPOSAL_ROUTES: Routes = [
  { path: '', redirectTo: 'create-proposal/new', pathMatch: 'full' },
  { path: 'create-proposal/:id', component: CreateProposalComponent },
];
