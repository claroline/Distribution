<?php

namespace Icap\BlogBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/06/15 02:27:07
 */
class Version20180615142639 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__blog_post 
            ADD pinned TINYINT(1) NOT NULL
        ');
        $this->addSql('
            ALTER TABLE icap__blog_options 
            ADD comment_moderation_mode SMALLINT DEFAULT NULL, 
            ADD display_full_posts TINYINT(1) NOT NULL
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__blog_options 
            DROP comment_moderation_mode, 
            DROP display_full_posts
        ');
        $this->addSql('
            ALTER TABLE icap__blog_post 
            DROP pinned
        ');
    }
}
