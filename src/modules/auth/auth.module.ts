import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
	ClientsModule,
	Transport,
} from '@nestjs/microservices';
import { AuthGuard } from '../../guards/auth/auth.guard';
import { RolesGuard } from '../../guards/auth/roles.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module( {
	         imports    : [ ClientsModule.register( [ {
		         name     : 'AUTH_SERVICE',
		         transport: Transport.TCP,
		         options  : {
			         host: 'localhost',
			         port: 3001,
		         },
	         },
	                                                ] ),
	         ],
	         controllers: [ AuthController ],
	         providers  : [ AuthService, {
		         provide : APP_GUARD,
		         useClass: AuthGuard,
	         }, {
		         provide : APP_GUARD,
		         useClass: RolesGuard,
	         },
	         ],
         } )
export class AuthModule {
}