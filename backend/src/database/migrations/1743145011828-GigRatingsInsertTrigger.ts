import { MigrationInterface, QueryRunner } from 'typeorm';

export class GigRatingsInsertTrigger1743145011828
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              DROP TRIGGER IF EXISTS gig_ratings_insert;
        `);

    await queryRunner.query(` 
          CREATE TRIGGER gig_ratings_insert
          AFTER INSERT ON rating
          FOR EACH ROW
          BEGIN
            -- Update the ratingCount and ratingAverage in the gig table
            UPDATE gig
            SET 
              ratingCount = (SELECT COUNT(*) FROM rating WHERE gig_id = NEW.gig_id),
              ratingAverage = (SELECT COALESCE(AVG(rate_number), 0) FROM rating WHERE gig_id = NEW.gig_id)
            WHERE id = NEW.gig_id;
          END 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS gig_ratings_insert;`);
  }
}
