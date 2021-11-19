import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnToTableBook1637272278435 implements MigrationInterface {
    name = 'addColumnToTableBook1637272278435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`taken\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`subscription\` \`subscription\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`subscription\` \`subscription\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`taken\``);
    }

}
