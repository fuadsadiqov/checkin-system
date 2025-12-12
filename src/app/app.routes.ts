import { Routes } from '@angular/router';
import { CheckinComponent } from './pages/checkin/checkin';
import { Check } from './pages/check/check';

export const routes: Routes = [
  {
    path: 'checkin',
    component: CheckinComponent,
  },
  {
    path: 'check',
    component: Check,
  },
];
