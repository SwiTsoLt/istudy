import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { StoreModule } from "@ngrx/store";
import { reducers, metaReducers } from "./store/index";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { WSEffects } from "./store/ws-store/ws.effects";
import { WebRtcEffects } from "./store/webrtc-store/webrtc.effects";
import { JoinerGuardService } from "./guards/joiner-guard.service";
import { OwnerGuardService } from "./guards/owner-guard.service";
import { PagesModule } from "./components/pages/pages.module";
import { UIModule } from "./components/UI/ui.module";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        PagesModule,
        UIModule,
        StoreModule.forRoot(reducers, {
            metaReducers
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: false,
            autoPause: true,
            features: {
                pause: false,
                lock: true,
                persist: true
            }
        }),
        EffectsModule.forRoot([WSEffects, WebRtcEffects])
    ],
    providers: [
        OwnerGuardService,
        JoinerGuardService
    ],
    bootstrap: [AppComponent],
    exports: [
    
    ]
})
export class AppModule { }
