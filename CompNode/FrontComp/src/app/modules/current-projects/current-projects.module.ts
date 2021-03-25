import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentProjectsComponent } from './current-projects.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: CurrentProjectsComponent }];

@NgModule({
	declarations: [CurrentProjectsComponent],
	imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CurrentProjectsModule {}
