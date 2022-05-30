import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloatingIslandComponent } from './components/floating-island/floating-island.component';
import { HauntedHouseComponent } from './components/haunted-house/haunted-house.component';
import { InteractiveLinesComponent } from './components/interactive-lines/interactive-lines.component';
import { LightComponent } from './components/light/light.component';
import { ShadowsComponent } from './components/shadows/shadows.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'floating-island'
  },
  {
    path: 'light',
    component: LightComponent
  },
  {
    path: 'shadows',
    component: ShadowsComponent
  },
  {
    path: 'haunted-house',
    component: HauntedHouseComponent
  },
  {
    path: 'floating-island',
    component: FloatingIslandComponent
  },
  {
    path: 'interactive-lines',
    component: InteractiveLinesComponent
  },
  {
    path: '**',
    redirectTo: 'light'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
