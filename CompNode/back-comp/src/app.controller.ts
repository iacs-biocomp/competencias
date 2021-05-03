import { Controller, Get } from '@nestjs/common';
import { Suite } from 'benchmark';
import { AppService } from './app.service';

@Controller('nest')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	test(): string {
		const suite = new Suite();
		suite
			.add('new promise', function () {
				return new Promise((resolve, reject) => {});
			})
			.on('cycle', function (event) {
				console.log(String(event.target));
			})
			.on('complete', function () {
				console.log('Fastest is ' + this.filter('fastest').map('name'));
			})
			.run();
		return this.appService.getHello();
	}
}
