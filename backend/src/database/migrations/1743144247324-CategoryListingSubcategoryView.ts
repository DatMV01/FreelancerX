import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryListingSubcategory1743144247324
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS category_listing_subcategory;`);

    await queryRunner.query(`
      CREATE VIEW category_listing_subcategory AS
          SELECT 
              parent.id AS parent_id,
              parent.title AS parent_title,
              GROUP_CONCAT(child.title
                  ORDER BY child.title
                  SEPARATOR ', ') AS subcategories
          FROM
              category AS parent
                  LEFT JOIN
              category AS child ON parent.id = child.parent_id
          WHERE
              parent.parent_id IS NULL
                  AND parent.deletedAt IS NULL
          GROUP BY parent.id
          ORDER BY subcategories DESC;

      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS category_listing_subcategory;`);
  }
}
