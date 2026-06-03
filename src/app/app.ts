import { Component, signal } from '@angular/core';
import { CitasComponent } from './components/citas/citas';

@Component({
  selector: 'app-root',
  imports: [CitasComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('sistema-citas');
}
