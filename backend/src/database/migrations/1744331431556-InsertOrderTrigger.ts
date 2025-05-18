import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertOrderTrigger1744331431556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DROP TRIGGER IF EXISTS gig_orders_insert;
        `);

    // await queryRunner.query(`
    //       CREATE TRIGGER gig_orders_insert
    //       AFTER INSERT ON orders
    //       FOR EACH ROW
    //       BEGIN
    //         -- Tăng orderCount lên 1 trong bảng gig
    //         UPDATE gigs
    //         SET orderCount = orderCount + 1
    //         WHERE id = NEW.gig_id;
    //       END;
    //     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS gig_orders_insert;`);
  }
}
