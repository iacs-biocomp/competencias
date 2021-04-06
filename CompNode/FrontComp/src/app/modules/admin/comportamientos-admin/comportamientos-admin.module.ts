import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComportamientosAdminComponent } from './comportamientos-admin.component';
import { TableComportComponent } from './table-comport/table-comport.component';



@NgModule({
  declarations: [ComportamientosAdminComponent, TableComportComponent],
  imports: [
    CommonModule
  ]
})
export class ComportamientosAdminModule { }
