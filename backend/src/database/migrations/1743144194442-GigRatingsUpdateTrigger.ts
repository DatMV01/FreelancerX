import { MigrationInterface, QueryRunner } from 'typeorm';

export class GigRatingsUpdateTrigger1743144194442
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS gig_reviews_update;
      `);

    await queryRunner.query(`
        CREATE TRIGGER gig_reviews_update
        AFTER UPDATE ON gig_reviews FOR EACH ROW
        BEGIN
            UPDATE gig
            SET
                ratingCount = (SELECT COUNT(*) FROM gig_reviews WHERE gig_id = NEW.gig_id),
                ratingAverage = (SELECT COALESCE(AVG(rate_number), 0) FROM gig_reviews WHERE gig_id = NEW.gig_id)
            WHERE id = NEW.gig_id;
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS gig_reviews_update;`);
  }
}
