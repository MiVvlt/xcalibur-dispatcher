import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
	const app = await NestFactory.create( AppModule );
	app.use( cookieParser() );
	// app.use(cors({
	// 	             origin     : process.env.CORS_ORIGINS.split( ',' ),
	//               methods:  process.env.CORS_METHODS.split( ',' ),
	//               credentials: true,
	//              }))
	// app.use(bodyParser.json({limit: '16mb'}));
	// app.use(bodyParser.urlencoded({limit: '16mb', extended: true}));
	await app.listen( parseInt(process.env.PORT) || 80 );
}

bootstrap();
