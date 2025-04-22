import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoriesCteView1743144209203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS categories_cte;`);

    await queryRunner.query(`
        CREATE VIEW categories_cte AS
        WITH RECURSIVE categories_tree AS (
          SELECT
            id, title, parent_id, slug, 1 AS level,
            title AS categories_path
          FROM categories
          WHERE parent_id IS NULL -- Chỉ lấy danh mục cha
  
          UNION ALL
  
          SELECT
            c.id, c.title, c.parent_id, c.slug, ct.level + 1,
            CONCAT(ct.categories_path, ' → ', c.title)
          FROM categories c
          INNER JOIN categories_tree ct ON c.parent_id = ct.id
        )
        SELECT * FROM categories_tree ORDER BY categories_path;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS categories_cte;`);
  }
}
