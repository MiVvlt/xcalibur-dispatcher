import {
	Inject,
	Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
	IAccessToken,
	ILoginCredentials,
	ILoginTokens,
	ITokenPayload,
} from '../../interfaces/auth.inferfaces';

@Injectable()
export class AuthService {
	constructor( @Inject( 'AUTH_SERVICE' ) private authClient: ClientProxy ) {}

	async getStatus(): Promise<Boolean> {
		return this.authClient.send<Boolean>( 'status', {} ).toPromise();
	}

	async getPayloadFromAccessToken( token: string ): Promise<ITokenPayload> {
		return this.authClient.send<ITokenPayload>( 'payload-from-access-token', token ).toPromise();
	}

	async refreshAccessToken( refreshToken: string ): Promise<IAccessToken> {
		return this.authClient.send<IAccessToken>( 'refresh-access-token', refreshToken ).toPromise();
	}

	async login( credentials: ILoginCredentials ): Promise<ILoginTokens> {
		return this.authClient.send<ILoginTokens>( 'login', credentials ).toPromise();
	}
}
