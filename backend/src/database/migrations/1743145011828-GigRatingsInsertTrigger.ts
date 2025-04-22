import { MigrationInterface, QueryRunner } from 'typeorm';

export class GigRatingsInsertTrigger1743145011828
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              DROP TRIGGER IF EXISTS user_review_gigs_insert;
        `);

    await queryRunner.query(` 
          CREATE TRIGGER user_review_gigs_insert
          AFTER INSERT ON user_review_gigs
          FOR EACH ROW
          BEGIN
            -- Update the ratingCount and ratingAverage in the gig table
            UPDATE gigs
            SET 
              ratingCount = (SELECT COUNT(*) FROM user_review_gigs WHERE gig_id = NEW.gig_id),
              ratingAverage = (SELECT COALESCE(AVG(rating), 0) FROM user_review_gigs WHERE gig_id = NEW.gig_id)
            WHERE id = NEW.gig_id;
          END 
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS user_review_gigs_insert;`);
  }
}
