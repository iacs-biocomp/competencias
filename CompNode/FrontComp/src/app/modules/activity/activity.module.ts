import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [{ path: '', component: ActivityComponent }];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
	declarations: [ActivityComponent],
})
export class ActivityModule {}
