import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-mini-reproductor',
  templateUrl: './mini-reproductor.component.html',
  styleUrl: './mini-reproductor.component.css'
})
export class MiniReproductorComponent implements OnInit {
  audioUrl: SafeUrl | null = null;

  constructor(private playerService: PlayerService) {}

  ngOnInit(): void {
    this.playerService.audioUrl$.subscribe(url => {
      this.audioUrl = url;
    });
  }
}
