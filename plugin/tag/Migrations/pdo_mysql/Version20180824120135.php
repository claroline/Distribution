<?php

namespace Claroline\TagBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2018/08/24 12:01:36
 */
class Version20180824120135 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE UNIQUE INDEX `unique` ON claro_tagbundle_tagged_object (
                object_id, object_class, object_name
            )
        ");
        $this->addSql("
            CREATE UNIQUE INDEX `unique` ON claro_tagbundle_tag (tag_name, user_id)
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP INDEX `unique` ON claro_tagbundle_tag
        ");
        $this->addSql("
            DROP INDEX `unique` ON claro_tagbundle_tagged_object
        ");
    }
}