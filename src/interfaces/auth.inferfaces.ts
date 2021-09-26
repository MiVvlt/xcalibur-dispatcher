export enum UserRoles {
	api = 'API', user = 'USER', admin = 'ADMIN', superAdmin = 'SUPER_ADMIN', godmode = 'GODMODE'
}

export interface ITokenPayload {
	sub: string;
	roles: UserRoles[];
}

export interface IAccessToken {
	accessToken: string;
}

export interface ILoginTokens {
	accessToken: string;
	refreshToken: string;
}

export interface ILoginCredentials {
	username: string;
	password: string;
}
