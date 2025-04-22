import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoriesListingSubcategories1743144247324
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS categories_listing_subcategories;`);

    await queryRunner.query(`
      CREATE VIEW categories_listing_subcategories AS
          SELECT 
              parent.id AS parent_id,
              parent.title AS parent_title,
              GROUP_CONCAT(child.title
                  ORDER BY child.title
                  SEPARATOR ', ') AS subcategories
          FROM
              categories AS parent
                  LEFT JOIN
              categories AS child ON parent.id = child.parent_id
          WHERE
              parent.parent_id IS NULL
                  AND parent.deletedAt IS NULL
          GROUP BY parent.id
          ORDER BY subcategories DESC;

      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS categories_listing_subcategories;`);
  }
}
