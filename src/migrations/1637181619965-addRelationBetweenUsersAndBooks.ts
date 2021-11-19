import {MigrationInterface, QueryRunner} from "typeorm";

export class addRelationBetweenUsersAndBooks1637181619965 implements MigrationInterface {
    name = 'addRelationBetweenUsersAndBooks1637181619965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_bb8627d137a861e2d5dc8d1eb20\``);
        await queryRunner.query(`CREATE TABLE \`users_books\` (\`usersId\` int NOT NULL, \`booksId\` int NOT NULL, INDEX \`IDX_9fb9dee7cd59bfe8b19aed4ab1\` (\`usersId\`), INDEX \`IDX_2b014ac07b5fdc8860328249e5\` (\`booksId\`), PRIMARY KEY (\`usersId\`, \`booksId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`users_books\` ADD CONSTRAINT \`FK_9fb9dee7cd59bfe8b19aed4ab10\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_books\` ADD CONSTRAINT \`FK_2b014ac07b5fdc8860328249e51\` FOREIGN KEY (\`booksId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_books\` DROP FOREIGN KEY \`FK_2b014ac07b5fdc8860328249e51\``);
        await queryRunner.query(`ALTER TABLE \`users_books\` DROP FOREIGN KEY \`FK_9fb9dee7cd59bfe8b19aed4ab10\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`userId\` int NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_2b014ac07b5fdc8860328249e5\` ON \`users_books\``);
        await queryRunner.query(`DROP INDEX \`IDX_9fb9dee7cd59bfe8b19aed4ab1\` ON \`users_books\``);
        await queryRunner.query(`DROP TABLE \`users_books\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_bb8627d137a861e2d5dc8d1eb20\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
