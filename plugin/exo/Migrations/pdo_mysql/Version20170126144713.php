<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2017/01/26 02:47:16
 */
class Version20170126144713 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE ujm_grid_item (
                id INT AUTO_INCREMENT NOT NULL, 
                coordsX INT DEFAULT NULL, 
                coordsY INT DEFAULT NULL, 
                uuid VARCHAR(36) NOT NULL, 
                data LONGTEXT DEFAULT NULL, 
                resourceNode_id INT DEFAULT NULL, 
                UNIQUE INDEX UNIQ_66B59764D17F50A6 (uuid), 
                INDEX IDX_66B59764B87FAB32 (resourceNode_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_grid_odd (
                id INT AUTO_INCREMENT NOT NULL, 
                item_id INT DEFAULT NULL, 
                pair_question_id INT DEFAULT NULL, 
                score DOUBLE PRECISION NOT NULL, 
                feedback LONGTEXT DEFAULT NULL, 
                INDEX IDX_858E80E4126F525E (item_id), 
                INDEX IDX_858E80E4B745DCF (pair_question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_grid_row (
                id INT AUTO_INCREMENT NOT NULL, 
                pair_question_id INT DEFAULT NULL, 
                ordered TINYINT(1) NOT NULL, 
                score DOUBLE PRECISION NOT NULL, 
                feedback LONGTEXT DEFAULT NULL, 
                INDEX IDX_F63A28D2B745DCF (pair_question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_grid_row_item (
                row_id INT NOT NULL, 
                item_id INT NOT NULL, 
                entity_order INT NOT NULL, 
                INDEX IDX_BF97D89083A269F2 (row_id), 
                INDEX IDX_BF97D890126F525E (item_id), 
                PRIMARY KEY(row_id, item_id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_question_pair (
                id INT AUTO_INCREMENT NOT NULL, 
                question_id INT DEFAULT NULL, 
                shuffle TINYINT(1) NOT NULL, 
                penalty DOUBLE PRECISION NOT NULL, 
                UNIQUE INDEX UNIQ_36819691E27F6BF (question_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            CREATE TABLE ujm_question_pair_items (
                question_id INT NOT NULL, 
                item_id INT NOT NULL, 
                INDEX IDX_D5F9CF051E27F6BF (question_id), 
                UNIQUE INDEX UNIQ_D5F9CF05126F525E (item_id), 
                PRIMARY KEY(question_id, item_id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_item 
            ADD CONSTRAINT FK_66B59764B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_odd 
            ADD CONSTRAINT FK_858E80E4126F525E FOREIGN KEY (item_id) 
            REFERENCES ujm_grid_item (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_odd 
            ADD CONSTRAINT FK_858E80E4B745DCF FOREIGN KEY (pair_question_id) 
            REFERENCES ujm_question_pair (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_row 
            ADD CONSTRAINT FK_F63A28D2B745DCF FOREIGN KEY (pair_question_id) 
            REFERENCES ujm_question_pair (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_row_item 
            ADD CONSTRAINT FK_BF97D89083A269F2 FOREIGN KEY (row_id) 
            REFERENCES ujm_grid_row (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_row_item 
            ADD CONSTRAINT FK_BF97D890126F525E FOREIGN KEY (item_id) 
            REFERENCES ujm_grid_item (id) 
            ON DELETE CASCADE
        ');
        $this->addSql('
            ALTER TABLE ujm_question_pair 
            ADD CONSTRAINT FK_36819691E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_question_pair_items 
            ADD CONSTRAINT FK_D5F9CF051E27F6BF FOREIGN KEY (question_id) 
            REFERENCES ujm_question_pair (id)
        ');
        $this->addSql('
            ALTER TABLE ujm_question_pair_items 
            ADD CONSTRAINT FK_D5F9CF05126F525E FOREIGN KEY (item_id) 
            REFERENCES ujm_grid_item (id)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE ujm_grid_odd 
            DROP FOREIGN KEY FK_858E80E4126F525E
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_row_item 
            DROP FOREIGN KEY FK_BF97D890126F525E
        ');
        $this->addSql('
            ALTER TABLE ujm_question_pair_items 
            DROP FOREIGN KEY FK_D5F9CF05126F525E
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_row_item 
            DROP FOREIGN KEY FK_BF97D89083A269F2
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_odd 
            DROP FOREIGN KEY FK_858E80E4B745DCF
        ');
        $this->addSql('
            ALTER TABLE ujm_grid_row 
            DROP FOREIGN KEY FK_F63A28D2B745DCF
        ');
        $this->addSql('
            ALTER TABLE ujm_question_pair_items 
            DROP FOREIGN KEY FK_D5F9CF051E27F6BF
        ');
        $this->addSql('
            DROP TABLE ujm_grid_item
        ');
        $this->addSql('
            DROP TABLE ujm_grid_odd
        ');
        $this->addSql('
            DROP TABLE ujm_grid_row
        ');
        $this->addSql('
            DROP TABLE ujm_grid_row_item
        ');
        $this->addSql('
            DROP TABLE ujm_question_pair
        ');
        $this->addSql('
            DROP TABLE ujm_question_pair_items
        ');
    }
}
