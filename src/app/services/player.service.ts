import { Injectable } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audioUrlSubject: BehaviorSubject<SafeUrl | null> = new BehaviorSubject<SafeUrl | null>(null);
  public audioUrl$: Observable<SafeUrl | null> = this.audioUrlSubject.asObservable();

  setAudioUrl(url: SafeUrl | null): void {
    this.audioUrlSubject.next(url);
  }
}
