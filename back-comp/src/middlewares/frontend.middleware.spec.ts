import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { parse } from 'dotenv';
import { parse as cookieParse } from 'cookie';
import { ConfigService } from 'src/config/config.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { FrontendMiddleware } from './frontend.middleware';
import { Configuration } from 'src/config/config.keys';
import { Suite } from 'benchmark';
import { Request, Response } from 'express';

describe('CatContractService', () => {
	let middleware: FrontendMiddleware;

	beforeEach(async () => {
		const envFilePath = __dirname + '/../../.env';
		const module: TestingModule = await Test.createTestingModule({
			providers: [FrontendMiddleware, AuthGuard, ConfigService],
		})
			.overrideProvider(ConfigService)
			.useValue({
				envConfig: parse(readFileSync(envFilePath)),

				/**
				 * Gets the requested env variable
				 * @param key The env var name
				 * @returns The env variable as string
				 */
				get(key: Configuration): string {
					return this.envConfig[key]!;
				},
			})
			.compile();

		middleware = module.get<FrontendMiddleware>(FrontendMiddleware);
	});

	it('should be defined', () => {
		expect(middleware).toBeDefined();
	});

	it('Run on 5s or less', () => {
		const cookies =
			'SID=Rk+hk/0TJF5PahXMx0YlN7jYBFGLZc2O; io=VfH-V0Mh2Monh8JRAABB; login-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtbDM2MGVzcEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkFNTDM2MCIsInBhc3N3b3JkIjoiJDJhJDEwJFg5dVdnbTVsS3RLSWdIYjdtYmJIc2ViU0VCODAzbHNYbU1ra3diOTg2UDNRLjl2QUtXMWdDIiwicm9sZXMiOlsiQURNSU4iLCJQVUJMSUMiXSwiaWF0IjoxNjM1NjQxMDEzLCJleHAiOjE2MzU2NDE2MTN9.mC3uECGcnFtEIxsIzzsymaSyWtqCcsMN8Co4Gmpratg';
		// console.log(cookieParse(cookies));

		const suite = new Suite();
		const req = { baseUrl: 'http://localhost:3000/api', headers: { cookie: 'dsadas' } } as Request;
		const res = { redirect: (url: string) => {} } as unknown as Response;
		// add tests
		suite
			.add('Test1', () => {
				cookieParse(cookies);
				middleware.use(req, res, () => {});
			})
			// add listeners
			.on('cycle', function (event) {
				console.log(String(event.target));
			})
			.on('complete', function () {
				console.log('Fastest is ' + this.filter('fastest').map('name'));
			})
			// run async
			.run();
	});
});
