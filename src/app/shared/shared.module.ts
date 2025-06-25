import { ProductoComponent } from './producto/producto.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ProductoComponent
  ],
  exports:[HeaderComponent,FooterComponent, ProductoComponent]
})
export class SharedModule { }
