import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  show = {
    image: false,
    null: false
  };



  constructor() { }
}
