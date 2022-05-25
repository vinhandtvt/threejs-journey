import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LightComponent } from './components/light/light.component';
import { ShadowsComponent } from './components/shadows/shadows.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'light'
  },
  {
    path: 'light',
    component: LightComponent
  },
  {
    path: 'shadows',
    component: ShadowsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
