<?php

namespace Claroline\ClacoFormBundle\Migrations\pdo_mysql;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2016/12/06 09:46:02
 */
class Version20161206094600 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE claro_clacoformbundle_field_choice_category (
                id INT AUTO_INCREMENT NOT NULL, 
                field_id INT NOT NULL, 
                category_id INT NOT NULL, 
                field_facet_choice_id INT DEFAULT NULL, 
                field_value VARCHAR(255) NOT NULL, 
                INDEX IDX_1F7C5EF7443707B0 (field_id), 
                INDEX IDX_1F7C5EF712469DE2 (category_id), 
                INDEX IDX_1F7C5EF7E07710C3 (field_facet_choice_id), 
                PRIMARY KEY(id)
            ) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB
        ");
        $this->addSql("
            ALTER TABLE claro_clacoformbundle_field_choice_category 
            ADD CONSTRAINT FK_1F7C5EF7443707B0 FOREIGN KEY (field_id) 
            REFERENCES claro_clacoformbundle_field (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_clacoformbundle_field_choice_category 
            ADD CONSTRAINT FK_1F7C5EF712469DE2 FOREIGN KEY (category_id) 
            REFERENCES claro_clacoformbundle_category (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE claro_clacoformbundle_field_choice_category 
            ADD CONSTRAINT FK_1F7C5EF7E07710C3 FOREIGN KEY (field_facet_choice_id) 
            REFERENCES claro_field_facet_choice (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE claro_clacoformbundle_field_choice_category
        ");
    }
}