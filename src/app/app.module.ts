import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LightComponent } from './components/light/light.component';
import { ShadowsComponent } from './components/shadows/shadows.component';
import { HauntedHouseComponent } from './components/haunted-house/haunted-house.component';
import { FloatingIslandComponent } from './components/floating-island/floating-island.component';
import { InteractiveLinesComponent } from './components/interactive-lines/interactive-lines.component';



@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    ShadowsComponent,
    HauntedHouseComponent,
    FloatingIslandComponent,
    InteractiveLinesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
