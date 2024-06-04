import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { PerfilUsuarioComponent } from './usuario/perfil-usuario/perfil-usuario.component';
import { CancionDetalleComponent } from './cancion/cancion-detalle/cancion-detalle.component';
import { SearchComponent } from './search/search.component';
import { MiniReproductorComponent } from './shared/mini-reproductor/mini-reproductor.component';
import { PlaylistComponent } from './listasReproduccion/playlist/playlist.component';
import { PlaylistspropiosComponent } from './listasReproduccion/playlistspropios/playlistspropios.component';
import { FormularioPlaylistComponent } from './listasReproduccion/formulario-playlist/formulario-playlist.component';
import { CrearusuarioComponent } from './usuario/crearusuario/crearusuario.component';
import { PlaylistDetailComponent } from './listasReproduccion/playlist-detail/playlist-detail.component';
import { AddToPlaylistDialogComponent } from './cancion/add-to-playlist-dialog/add-to-playlist-dialog.component';
import { BusquedaPlaylistComponent } from './listasReproduccion/busqueda-playlist/busqueda-playlist.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { CancionService } from './services/cancion.service';
import { PlayerService } from './services/player.service';
import { BuscarCancionesComponent } from './cancion/buscar-canciones/buscar-canciones.component';
import { UploadCancionComponent } from './cancion/upload-cancion/upload-cancion.component';
import { TusCancionesComponent } from './cancion/tus-canciones/tus-canciones.component';
import { ModificarCancionComponent } from './cancion/modificar-cancion/modificar-cancion.component';
import { BuscarUsuarioComponent } from './usuario/buscar-usuario/buscar-usuario.component';
import { EventoFormComponent } from './evento/evento-form/evento-form.component';
import { EventoListComponent } from './evento/evento-list/evento-list.component';
import { ModificarEventoComponent } from './evento/evento-modificar/evento-modificar.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumListComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    PerfilUsuarioComponent,
    CancionDetalleComponent,
    SearchComponent,
    MiniReproductorComponent,
    PlaylistComponent,
    PlaylistspropiosComponent,
    FormularioPlaylistComponent,
    CrearusuarioComponent,
    PlaylistDetailComponent,
    AddToPlaylistDialogComponent,
    BusquedaPlaylistComponent,
    BuscarCancionesComponent,
    UploadCancionComponent,
    TusCancionesComponent,
    ModificarCancionComponent,
    BuscarUsuarioComponent,
    EventoFormComponent,
    EventoListComponent,
    ModificarEventoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [
    provideAnimationsAsync(),
    CancionService,
    PlayerService,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
