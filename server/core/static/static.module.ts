import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Environment } from 'server/core/config/environment.enum';

@Module({})
export class StaticModule {
  static forRoot(): DynamicModule {
    const imports =
      process.env.NODE_ENV === Environment.Production
        ? [
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', '..', '..', 'client', 'build'),
              exclude: ['/api*'],
            }),
          ]
        : undefined;

    return {
      module: StaticModule,
      imports,
    };
  }
}
