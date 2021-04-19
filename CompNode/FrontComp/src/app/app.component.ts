import { Component, OnInit } from '@angular/core';
import * as Aos from 'aos';
// import { environment as cnf } from 'src/environments/environment';
// import { remove as cookieRm } from 'js-cookie';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	title = 'Competencias';
	/**
	 * Function that will remove the JWT from the cookies and localStorage when the user close the tab
	 */
	ngOnInit(): void {
		// const jwtLoginName = ;
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
