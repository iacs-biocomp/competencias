import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-empty-state [textToShow]',
	templateUrl: 'empty-state.component.html',
	styleUrls: ['empty-state.component.scss'],
})
export class EmptyStateComponent {
	@Input() textToShow!: string;
}
