import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './commons/navbar/navbar.component';
import { FooterComponent } from './commons/footer/footer.component';
import { AuthModule } from './auth/auth.module';
import { PagesModule } from './pages/pages.module';
import { ModalIniciarSesionComponent } from './commons/modal-iniciar-sesion/modal-iniciar-sesion.component';
import { UserProfileGuardComponent } from './pages/user-profile-page/user-profile-guard/user-profile-guard.component';
import { UserProfileModelosComponent } from './pages/user-profile-page/user-profile-modelos/user-profile-modelos.component';
import { UserProfileLikeComponent } from './pages/user-profile-page/user-profile-like/user-profile-like.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModeloPageModule } from "./pages/modelos/modelo-page.module";
import { RouterModule } from '@angular/router';
import { InfoLandingComponent } from './pages/info-pages/info-landing/info-landing.component';
import { CookieNoticeComponent } from './commons/cookie-notice/cookie-notice.component';



@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        NavbarComponent,
        ModalIniciarSesionComponent,
        InfoLandingComponent,
        CookieNoticeComponent
    ],
    providers: [NavbarComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        PagesModule,
        AuthModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ModeloPageModule,
    ]
})
export class AppModule { }
