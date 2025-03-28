import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryCountSubcategory1743144809088
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS category_count_subcategory;`);

    await queryRunner.query(`
          CREATE VIEW category_count_subcategory AS
          SELECT
            parent.id,
            parent.title,
            COUNT(child.id) AS subcategory_count
          FROM
            category AS parent
            LEFT JOIN
            category AS child ON parent.id = child.parent_id
          WHERE
            parent.deletedAt IS NULL
          GROUP BY parent.id
          ORDER BY subcategory_count DESC;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS category_count_subcategory;`);
  }
}
