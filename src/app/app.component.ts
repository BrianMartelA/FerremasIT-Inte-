import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxPayPalModule } from 'ngx-paypal';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxPayPalModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FerremasIT';
}
