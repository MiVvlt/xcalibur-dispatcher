import {
	Controller,
	Get,
	Logger,
} from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './guards/auth/is-public.decorator';

@Controller()
export class AppController {

	private logger = new Logger( 'AppController' );

	constructor( private readonly appService: AppService ) {}

	@Public() @Get( 'version' ) getVersion(): { version: string; } {
		return this.appService.getVersion();
	}
}
