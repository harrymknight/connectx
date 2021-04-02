import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from '@nestjsplus/knex';
import { AppController } from './app.controller';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { WordsModule } from './words/words.module';
import { ColoursModule } from './colours/colours.module';
import dbConfig from '../config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig]
    }),
    KnexModule.registerAsync({
      useFactory: dbConfig
    }),
    SharedModule,
    AuthModule,
    PlayersModule,
    MatchModule,
    WordsModule,
    ColoursModule
  ],
  controllers: [AppController],
})
export class AppModule { }
