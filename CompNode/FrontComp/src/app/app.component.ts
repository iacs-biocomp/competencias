import { Component, OnInit } from '@angular/core';
import * as Aos from 'aos';
import { remove as cookieRm } from 'js-cookie';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'ngInvess';
	/**
	 * Function that will remove the JWT from the cookies and localStorage when the user close the tab
	 */
	ngOnInit(): void {
		//TODO: Cambiar el 'login-token' por una variable de entorno por si en un futuro se cambia el nombre
		const jwtLoginName = 'login-token';
		// window.onbeforeunload = () => {
		// 	localStorage.removeItem(jwtLoginName);
		// 	cookieRm(jwtLoginName);
		// };
		Aos.init({
			duration: 700,
			once: true,
		});
	}
}
