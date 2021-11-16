import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSeedForUser1637092695113 implements MigrationInterface {
  name = 'CreateSeedForUser1637092695113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // password: admin
    await queryRunner.query(
      `INSERT INTO users (username, email, password, subscription, role) VALUES ('admin', 'admin@gmail.com', '$2a$10$3NBXbwsAwId/uWumTFd2f.aQFtYTrKrizRtxpRJQF68dM2uvXICNu', 1, 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
