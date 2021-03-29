import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'public-component',
	templateUrl: 'public.component.html',
	styleUrls: ['./public.component.css'],
})
export class PublicComponent implements OnInit {
	//Test de imagenes random
	imgs: string[] = [
		'../../../assets/images/test.jpg',
		'../../../assets/images/test1.jpg',
	];
	myImg: string;
	constructor() {
		const random = Math.floor(Math.random() * 2);
		this.myImg = this.imgs[random];
	}

	ngOnInit() {
		setInterval(() => {
			const numRnd = Math.floor(Math.random() * this.imgs.length);
			this.myImg = this.imgs[numRnd];
		}, 1000);
	}
}
