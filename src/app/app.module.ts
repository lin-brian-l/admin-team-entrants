import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { MatAutocompleteModule, MatInputModule } from "@angular/material";
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { TeamPlayers } from "./team-players.pipe";

@NgModule({
  declarations: [
    AppComponent,
    TeamPlayers
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
