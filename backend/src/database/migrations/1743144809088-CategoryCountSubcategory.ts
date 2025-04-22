import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoriesCountSubcategories1743144809088
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS categories_count_subcategories;`);

    await queryRunner.query(`
          CREATE VIEW categories_count_subcategories AS
          SELECT
            parent.id,
            parent.title,
            COUNT(child.id) AS subcategories_count
          FROM
            categories AS parent
            LEFT JOIN
            categories AS child ON parent.id = child.parent_id
          WHERE
            parent.deletedAt IS NULL
          GROUP BY parent.id
          ORDER BY subcategories_count DESC;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS categories_count_subcategories;`);
  }
}
