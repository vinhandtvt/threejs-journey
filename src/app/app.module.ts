import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LightComponent } from './components/light/light.component';
import { ShadowsComponent } from './components/shadows/shadows.component';

@NgModule({
  declarations: [
    AppComponent,
    LightComponent,
    ShadowsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
