<?php

namespace UJM\ExoBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2017/07/06 11:07:17
 */
class Version20170706110717 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_interaction_graphic
            ADD pointerMode VARCHAR(255) NOT NULL
        ");

        $this->addSql("
            UPDATE ujm_interaction_graphic
            SET pointerMode='pointer'
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE ujm_interaction_graphic
            DROP pointerMode
        ");
    }
}
