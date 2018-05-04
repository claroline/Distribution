<?php

namespace Icap\BlogBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution.
 *
 * Generation date: 2018/03/13 09:20:45
 */
class Version20180313092037 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql('
            ALTER TABLE icap__blog_post 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        //add blog post UUID
        $this->addSql('
            UPDATE icap__blog_post SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_1B067922D17F50A6 ON icap__blog_post (uuid)
        ');

        $this->addSql('
            ALTER TABLE icap__blog_comment 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        //add comment UUID
        $this->addSql('
            UPDATE icap__blog_comment SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_95EB616FD17F50A6 ON icap__blog_comment (uuid)
        ');

        $this->addSql('
            ALTER TABLE icap__blog 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        //add blog UUID
        $this->addSql('
            UPDATE icap__blog SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_FD75E6C4D17F50A6 ON icap__blog (uuid)
        ');

        $this->addSql('
            ALTER TABLE icap__blog_options 
            ADD uuid VARCHAR(36) NOT NULL
        ');
        //add blog options UUID
        $this->addSql('
            UPDATE icap__blog_options SET uuid = (SELECT UUID())
        ');
        $this->addSql('
            CREATE UNIQUE INDEX UNIQ_D1AAC984D17F50A6 ON icap__blog_options (uuid)
        ');
    }

    public function down(Schema $schema)
    {
        $this->addSql('
            DROP INDEX UNIQ_FD75E6C4D17F50A6 ON icap__blog
        ');
        $this->addSql('
            ALTER TABLE icap__blog 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_95EB616FD17F50A6 ON icap__blog_comment
        ');
        $this->addSql('
            ALTER TABLE icap__blog_comment 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_D1AAC984D17F50A6 ON icap__blog_options
        ');
        $this->addSql('
            ALTER TABLE icap__blog_options 
            DROP uuid
        ');
        $this->addSql('
            DROP INDEX UNIQ_1B067922D17F50A6 ON icap__blog_post
        ');
        $this->addSql('
            ALTER TABLE icap__blog_post 
            DROP uuid
        ');
    }
}
