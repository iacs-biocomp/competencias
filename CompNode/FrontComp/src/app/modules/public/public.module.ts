import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: PublicComponent }];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	declarations: [PublicComponent],
})
export class PublicModule {}
