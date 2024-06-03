import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guardianes/login.guard';
import { PerfilUsuarioComponent } from './usuario/perfil-usuario/perfil-usuario.component';
import { CancionDetalleComponent } from './cancion/cancion-detalle/cancion-detalle.component';
import { PlaylistComponent } from './listasReproduccion/playlist/playlist.component';
import { PlaylistspropiosComponent } from './listasReproduccion/playlistspropios/playlistspropios.component';
import { FormularioPlaylistComponent } from './listasReproduccion/formulario-playlist/formulario-playlist.component';
import { CrearusuarioComponent } from './usuario/crearusuario/crearusuario.component';
import { PlaylistDetailComponent } from './listasReproduccion/playlist-detail/playlist-detail.component';
import { PlaylistResolver } from './resolver/playlist.resolver';
import { BusquedaPlaylistComponent } from './listasReproduccion/busqueda-playlist/busqueda-playlist.component';
import { BuscarCancionesComponent } from './cancion/buscar-canciones/buscar-canciones.component';
import { UploadCancionComponent } from './cancion/upload-cancion/upload-cancion.component';
import { TusCancionesComponent } from './cancion/tus-canciones/tus-canciones.component';
import { ModificarCancionComponent } from './cancion/modificar-cancion/modificar-cancion.component';
import { BuscarUsuarioComponent } from './usuario/buscar-usuario/buscar-usuario.component';

const routes: Routes = [
  {path:'lista-albumnes',component:AlbumListComponent, canActivate: [LoginGuard]},
  {path:'login',component:LoginComponent},
  { path: 'perfil-usuario', component: PerfilUsuarioComponent, canActivate: [LoginGuard] },
  { path: 'crear-usuario', component: CrearusuarioComponent},
  { path: 'cancion/:id', component: CancionDetalleComponent, canActivate: [LoginGuard] },
  { path: 'playlists', component: PlaylistComponent, canActivate: [LoginGuard] },
  { path: 'ver-todos', redirectTo: 'playlists', pathMatch: 'full' },
  { path: 'ver-tus-playlists', component:PlaylistspropiosComponent, canActivate: [LoginGuard] },
  { path: 'crear-playlists', component:FormularioPlaylistComponent, canActivate: [LoginGuard] },
  { path: 'playlist/:playlistID', component:PlaylistDetailComponent, canActivate: [LoginGuard] },
  { path: 'buscar-playlists', component: BusquedaPlaylistComponent, canActivate: [LoginGuard] },
  { path: 'buscar-canciones', component: BuscarCancionesComponent, canActivate: [LoginGuard] },
  { path: 'subir-cancion', component: UploadCancionComponent, canActivate: [LoginGuard] },
  { path: 'tus-canciones', component: TusCancionesComponent, canActivate: [LoginGuard] },
  { path: 'modificar/:id', component: ModificarCancionComponent, canActivate: [LoginGuard] },
  { path: 'buscar-usuarios', component: BuscarUsuarioComponent, canActivate: [LoginGuard] },
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
