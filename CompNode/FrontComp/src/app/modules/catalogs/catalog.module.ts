import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogComponent } from './catalog.component';
import { OrientService } from './catalogs/orient.service';
import { MaterialModule } from './mat.module';

const routes: Routes = [{ path: '', component: CatalogComponent }];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
	exports: [],
	declarations: [CatalogComponent],
	providers: [OrientService],
})
export class CatalogModule {}
