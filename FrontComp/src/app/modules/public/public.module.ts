import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CompRoutes } from 'src/app/types/angular-modified-types';

const routes: CompRoutes = [{ path: '', component: PublicComponent }];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	declarations: [PublicComponent],
})
export class PublicModule {}
