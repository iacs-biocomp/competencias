import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRegisterRequestDTO } from 'sharedInterfaces/DTO';

interface form {
	username: string;
	password: string;
	email: string;
	name: string;
	surnames: string;
	DNI: string;
	phone: number;
	institution: string;
}

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	/**Formulario bindeado con la vista */
	signupForm!: FormGroup;

	constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {}
	async sendForm() {
		let registerReq: IRegisterRequestDTO;
		const value: form = this.signupForm.value;
		if (this.signupForm.valid) {
			const logued: boolean = await this.authService.sendRegisterReq({
				username: value.username,
				password: value.password,
				name: value.name,
				surnames: value.surnames,
				DNI: value.DNI,
				phone: +value.phone,
				institution: value.institution,
				email: value.email,
			});
			console.log(logued);
			if (logued) {
				this.router.navigate(['/']);
			} else {
				alert('No se ha efectuado el registro');
			}
		}
	}
	ngOnInit(): void {
		this.signupForm = this.fb.group({
			username: ['', Validators.required],
			password: ['', Validators.required],
			email: ['', Validators.required],
			name: ['', Validators.required],
			surnames: ['', Validators.required],
			DNI: ['', Validators.required],
			phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
			institution: ['', Validators.required],
		});

		//Pasar usuario a mayusculas
		const username = this.signupForm.controls.username;
		username.valueChanges.subscribe((value: string) => {
			username.setValue(value.toUpperCase(), { emitEvent: false });
		});

		setInterval(() => {
			console.log(this.signupForm);
			console.log(this.signupForm.valid);
		}, 5000);
	}
}
