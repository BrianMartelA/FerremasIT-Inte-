import { Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent {

}
