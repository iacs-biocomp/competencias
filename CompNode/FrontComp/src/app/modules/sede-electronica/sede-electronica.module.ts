import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SedeElectronicaComponent } from './sede-electronica.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: '', component: SedeElectronicaComponent }];

@NgModule({
	declarations: [SedeElectronicaComponent],
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class SedeElectronicaModule {}
