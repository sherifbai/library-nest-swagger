import { ConnectionOptions } from 'typeorm';

export const ormconfig: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'root',
  port: 3306,
  database: 'library',
  synchronize: false,
  entities: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
