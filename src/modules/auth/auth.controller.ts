import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Logger,
	Post,
	Req,
	Res,
} from '@nestjs/common';
import { Public } from '../../guards/auth/is-public.decorator';
import {
	IAccessToken,
	ILoginCredentials,
} from '../../interfaces/auth.inferfaces';
import { AuthService } from './auth.service';
import * as jwtDecode from 'jwt-decode';

@Controller( 'auth' )
export class AuthController {
	private static refreshTokenCookieKey = 'refresh_token';
	private logger: Logger               = new Logger( 'AuthController' );

	constructor( private authService: AuthService ) {}

	@Public() @Get( 'status' )
	async getStatus(): Promise<Boolean> {
		try {
			return await this.authService.getStatus();
		} catch ( e ) {
			this.logger.error( e );
			return false;
		}
	}

	@Public() @Get( 'refresh-token' )
	async getRefreshToken( @Req() req: any ): Promise<IAccessToken> {
		const refreshToken: string = req?.cookies[ AuthController.refreshTokenCookieKey ];
		if ( !refreshToken ) {
			throw new HttpException( 'ERROR.AUTH.NO_REFRESH_TOKEN_COOKIE', HttpStatus.UNAUTHORIZED );
		}
		return await this.authService.refreshAccessToken( refreshToken );
	}

	@Public() @Get( 'logout' )
	async logout( @Res() res ) {
		res.clearCookie( AuthController.refreshTokenCookieKey, {
			httpOnly: true,
			secure  : process.env.SECURE_COOKIES === 'true',
			path    : '/',
		} );
		return res.send();
	}

	@Public() @Post( 'login' )
	async login( @Res() res, @Body() credentials: ILoginCredentials ) {
		// get access and refresh tokens
		const {
			      refreshToken,
			      accessToken,
		      } = await this.authService.login( credentials );

		// cookie expires when token expires
		const expiration = ( jwtDecode.default( refreshToken ) as { exp: string } ).exp + '000';

		// set response cookie
		res.cookie( AuthController.refreshTokenCookieKey, refreshToken, {
			httpOnly: true,
			secure  : process.env.SECURE_COOKIES === 'true',
			path    : '/',
			expires : new Date( parseInt( expiration ) ),
		} );

		// return accessToken for clients to store
		return { accessToken };
	}
}
