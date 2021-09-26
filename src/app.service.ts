import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getVersion(): { version: string } {
		const { version } = require( '../package.json' );
		return { version };
	}
}
