import { Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { HeaderComponent } from "../../shared/header/header.component";
import { ProductoComponent } from '../../shared/producto/producto.component';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [SharedModule, ProductoComponent],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.css'
})
export class CatalogueComponent {

}
