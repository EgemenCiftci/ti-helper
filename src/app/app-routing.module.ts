import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WizardComponent } from './components/wizard/wizard.component';

const routes: Routes = [
  { path: '', redirectTo: 'wizard', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'wizard', component: WizardComponent },
  { path: '**', redirectTo: 'wizard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }