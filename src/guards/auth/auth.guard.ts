import {
    Injectable,
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../modules/auth/auth.service';
import { IS_PUBLIC_KEY } from './is-public.decorator';

@Injectable()
export class AuthGuard
    implements CanActivate {
    private logger = new Logger( 'AppController' );

    constructor( private readonly authService: AuthService, private reflector: Reflector ) {
    }

    async canActivate( context: ExecutionContext ): Promise<boolean> {
        const isPublic = this.reflector
                             .getAllAndOverride<boolean>( IS_PUBLIC_KEY, [ context.getHandler(), context.getClass() ] );

        const req = context.switchToHttp()
                           .getRequest();

        if ( isPublic ) {
            return true;
        }

        const authorization = req?.headers[ 'authorization' ] || undefined;


        if ( !authorization ) {
            throw new HttpException( 'ERRORS.AUTH.NO_AUTHORIZATION_HEADER', HttpStatus.UNAUTHORIZED );
        }

        let payload;

        try {
            const token = authorization.split( ' ' )[ 1 ];
            req.token   = token;
            payload     = await this.authService.getPayloadFromAccessToken( token );
        } catch ( err ) {
            this.logger.error(err);
            throw new HttpException( 'ERRORS.AUTH.INVALID_ACCESS_TOKEN', HttpStatus.UNAUTHORIZED );
        }
        if ( !payload || !payload.sub ) {
            throw new HttpException( 'ERRORS.AUTH.INVALID_ACCESS_TOKEN', HttpStatus.UNAUTHORIZED );
        } else {
            req.user = payload;
            return true;
        }
    }
}


