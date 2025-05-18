import { MigrationInterface, QueryRunner } from 'typeorm';

export class GigRatingsUpdateTrigger1743144194442
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS user_review_gigs_update;
      `);

    // await queryRunner.query(`
    //     CREATE TRIGGER user_review_gigs_update
    //     AFTER UPDATE ON user_review_gigs FOR EACH ROW
    //     BEGIN
    //         UPDATE gigs
    //         SET
    //             ratingCount = (SELECT COUNT(*) FROM user_review_gigs WHERE gig_id = NEW.gig_id),
    //             ratingAverage = (SELECT COALESCE(AVG(rating), 0) FROM user_review_gigs WHERE gig_id = NEW.gig_id)
    //         WHERE id = NEW.gig_id;
    //     END
    // `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS user_review_gigs_update;`);
  }
}
