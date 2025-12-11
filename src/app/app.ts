import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CheckinComponent } from "./pages/checkin/checkin";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CheckinComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('event-checkin');
}
