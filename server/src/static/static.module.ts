import { DynamicModule, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({})
export class StaticModule {
  static forRoot(): DynamicModule {
    console.log(process.env.NODE_ENV);

    const imports =
      process.env.NODE_ENV === 'production'
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
