<?php

namespace Icap\DropzoneBundle\Migrations\pdo_sqlsrv;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2014/03/26 08:35:57
 */
class Version20140326083554 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            ADD correction_instruction VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            ADD success_message VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            ADD fail_message VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            DROP COLUMN correctionInstruction
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            DROP COLUMN successMessage
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            DROP COLUMN failMessage
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            ADD correctionInstruction VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            ADD successMessage VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            ADD failMessage VARCHAR(MAX)
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            DROP COLUMN correction_instruction
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            DROP COLUMN success_message
        ");
        $this->addSql("
            ALTER TABLE icap__dropzonebundle_dropzone 
            DROP COLUMN fail_message
        ");
    }
}