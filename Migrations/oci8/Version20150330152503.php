<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\oci8;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2015/03/30 03:25:05
 */
class Version20150330152503 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediacenter (
                id NUMBER(10) NOT NULL, 
                url VARCHAR2(255) NOT NULL, 
                driver VARCHAR2(255) NOT NULL, 
                host VARCHAR2(255) NOT NULL, 
                port VARCHAR2(255) NOT NULL, 
                dbname VARCHAR2(255) NOT NULL, 
                \"user\" VARCHAR2(255) NOT NULL, 
                password VARCHAR2(255) NOT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            DECLARE constraints_Count NUMBER; BEGIN 
            SELECT COUNT(CONSTRAINT_NAME) INTO constraints_Count 
            FROM USER_CONSTRAINTS 
            WHERE TABLE_NAME = 'INWICAST_PLUGIN_MEDIACENTER' 
            AND CONSTRAINT_TYPE = 'P'; IF constraints_Count = 0 
            OR constraints_Count = '' THEN EXECUTE IMMEDIATE 'ALTER TABLE INWICAST_PLUGIN_MEDIACENTER ADD CONSTRAINT INWICAST_PLUGIN_MEDIACENTER_AI_PK PRIMARY KEY (ID)'; END IF; END;
        ");
        $this->addSql("
            CREATE SEQUENCE INWICAST_PLUGIN_MEDIACENTER_SEQ START WITH 1 MINVALUE 1 INCREMENT BY 1
        ");
        $this->addSql("
            CREATE TRIGGER INWICAST_PLUGIN_MEDIACENTER_AI_PK BEFORE INSERT ON INWICAST_PLUGIN_MEDIACENTER FOR EACH ROW DECLARE last_Sequence NUMBER; last_InsertID NUMBER; BEGIN 
            SELECT INWICAST_PLUGIN_MEDIACENTER_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; IF (
                : NEW.ID IS NULL 
                OR : NEW.ID = 0
            ) THEN 
            SELECT INWICAST_PLUGIN_MEDIACENTER_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; ELSE 
            SELECT NVL(Last_Number, 0) INTO last_Sequence 
            FROM User_Sequences 
            WHERE Sequence_Name = 'INWICAST_PLUGIN_MEDIACENTER_SEQ'; 
            SELECT : NEW.ID INTO last_InsertID 
            FROM DUAL; WHILE (last_InsertID > last_Sequence) LOOP 
            SELECT INWICAST_PLUGIN_MEDIACENTER_SEQ.NEXTVAL INTO last_Sequence 
            FROM DUAL; END LOOP; END IF; END;
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_media (
                id NUMBER(10) NOT NULL, 
                widgetinstance_id NUMBER(10) DEFAULT NULL NULL, 
                mediaRef VARCHAR2(255) NOT NULL, 
                preview_url VARCHAR2(255) DEFAULT NULL NULL, 
                width NUMBER(10) NOT NULL, 
                height NUMBER(10) NOT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            DECLARE constraints_Count NUMBER; BEGIN 
            SELECT COUNT(CONSTRAINT_NAME) INTO constraints_Count 
            FROM USER_CONSTRAINTS 
            WHERE TABLE_NAME = 'INWICAST_PLUGIN_MEDIA' 
            AND CONSTRAINT_TYPE = 'P'; IF constraints_Count = 0 
            OR constraints_Count = '' THEN EXECUTE IMMEDIATE 'ALTER TABLE INWICAST_PLUGIN_MEDIA ADD CONSTRAINT INWICAST_PLUGIN_MEDIA_AI_PK PRIMARY KEY (ID)'; END IF; END;
        ");
        $this->addSql("
            CREATE SEQUENCE INWICAST_PLUGIN_MEDIA_SEQ START WITH 1 MINVALUE 1 INCREMENT BY 1
        ");
        $this->addSql("
            CREATE TRIGGER INWICAST_PLUGIN_MEDIA_AI_PK BEFORE INSERT ON INWICAST_PLUGIN_MEDIA FOR EACH ROW DECLARE last_Sequence NUMBER; last_InsertID NUMBER; BEGIN 
            SELECT INWICAST_PLUGIN_MEDIA_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; IF (
                : NEW.ID IS NULL 
                OR : NEW.ID = 0
            ) THEN 
            SELECT INWICAST_PLUGIN_MEDIA_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; ELSE 
            SELECT NVL(Last_Number, 0) INTO last_Sequence 
            FROM User_Sequences 
            WHERE Sequence_Name = 'INWICAST_PLUGIN_MEDIA_SEQ'; 
            SELECT : NEW.ID INTO last_InsertID 
            FROM DUAL; WHILE (last_InsertID > last_Sequence) LOOP 
            SELECT INWICAST_PLUGIN_MEDIA_SEQ.NEXTVAL INTO last_Sequence 
            FROM DUAL; END LOOP; END IF; END;
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_ED925F022DE7D582 ON inwicast_plugin_media (widgetinstance_id)
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_media 
            ADD CONSTRAINT FK_ED925F022DE7D582 FOREIGN KEY (widgetinstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE inwicast_plugin_mediacenter
        ");
        $this->addSql("
            DROP TABLE inwicast_plugin_media
        ");
    }
}