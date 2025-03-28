import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryCteView1743144209203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS category_cte;`);

    await queryRunner.query(`
        CREATE VIEW category_cte AS
        WITH RECURSIVE category_tree AS (
          SELECT
            id, title, parent_id, slug, 1 AS level,
            title AS category_path
          FROM category
          WHERE parent_id IS NULL -- Chỉ lấy danh mục cha
  
          UNION ALL
  
          SELECT
            c.id, c.title, c.parent_id, c.slug, ct.level + 1,
            CONCAT(ct.category_path, ' → ', c.title)
          FROM category c
          INNER JOIN category_tree ct ON c.parent_id = ct.id
        )
        SELECT * FROM category_tree ORDER BY category_path;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS category_cte;`);
  }
}
