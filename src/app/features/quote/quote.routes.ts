import { Routes } from '@angular/router';
import { CreateQuoteComponent } from './components/create-quote/create-quote.component';
import { ReviewQuoteComponent } from './components/review-quote/review-quote.component';

export const QUOTE_ROUTES: Routes = [
  { path: '', redirectTo: 'create-quote', pathMatch: 'full' },
  { path: 'create-quote', component: CreateQuoteComponent },
  { path: 'review-quote', component: ReviewQuoteComponent },
];
