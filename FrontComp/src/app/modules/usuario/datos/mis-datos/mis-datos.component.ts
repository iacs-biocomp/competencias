import { Component, OnInit } from '@angular/core';
import { IUser } from 'sharedInterfaces/Entity';
import { JwtService } from 'src/app/services/auth/jwt.service';
import { LogService } from 'src/app/shared/log/log.service';
import { UserDataService } from '../user-data.service';

@Component({
	selector: 'app-mis-datos',
	templateUrl: './mis-datos.component.html',
	styleUrls: ['./mis-datos.component.scss'],
})
export class MisDatosComponent implements OnInit {
	userData?: IUser;

	constructor(
		private readonly usrDataService: UserDataService,
		private readonly jwtServ: JwtService,
		private readonly logger: LogService,
	) {}

	async ngOnInit(): Promise<void> {
		const decodedTkn = this.jwtServ.getDecodedToken();
		if (!decodedTkn) {
			const msg = 'Token not find when loading MisDatosComponent';
			const err = new Error(msg);
			this.logger.error(msg, err);
			throw err;
		}
		this.userData = await this.usrDataService.getUserData(decodedTkn.username);
		// LOG: datos del usuario obtenidos ${this.userData}
	}
}
