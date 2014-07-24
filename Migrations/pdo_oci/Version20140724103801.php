<?php

namespace Inwicast\ClarolinePluginBundle\Migrations\pdo_oci;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated migration based on mapping information: modify it with caution
 *
 * Generation date: 2014/07/24 10:38:02
 */
class Version20140724103801 extends AbstractMigration
{
    public function up(Schema $schema)
    {
        $this->addSql("
            CREATE TABLE inwicast_plugin_media (
                id NUMBER(10) NOT NULL, 
                code VARCHAR2(255) NOT NULL, 
                title VARCHAR2(255) NOT NULL, 
                description CLOB NOT NULL, 
                \"date\" DATE NOT NULL, 
                image VARCHAR2(255) NOT NULL, 
                width NUMBER(10) NOT NULL, 
                height NUMBER(10) NOT NULL, 
                widgetInstance_id NUMBER(10) DEFAULT NULL, 
                resourceNode_id NUMBER(10) DEFAULT NULL, 
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
            CREATE SEQUENCE INWICAST_PLUGIN_MEDIA_ID_SEQ START WITH 1 MINVALUE 1 INCREMENT BY 1
        ");
        $this->addSql("
            CREATE TRIGGER INWICAST_PLUGIN_MEDIA_AI_PK BEFORE INSERT ON INWICAST_PLUGIN_MEDIA FOR EACH ROW DECLARE last_Sequence NUMBER; last_InsertID NUMBER; BEGIN 
            SELECT INWICAST_PLUGIN_MEDIA_ID_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; IF (
                : NEW.ID IS NULL 
                OR : NEW.ID = 0
            ) THEN 
            SELECT INWICAST_PLUGIN_MEDIA_ID_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; ELSE 
            SELECT NVL(Last_Number, 0) INTO last_Sequence 
            FROM User_Sequences 
            WHERE Sequence_Name = 'INWICAST_PLUGIN_MEDIA_ID_SEQ'; 
            SELECT : NEW.ID INTO last_InsertID 
            FROM DUAL; WHILE (last_InsertID > last_Sequence) LOOP 
            SELECT INWICAST_PLUGIN_MEDIA_ID_SEQ.NEXTVAL INTO last_Sequence 
            FROM DUAL; END LOOP; END IF; END;
        ");
        $this->addSql("
            CREATE INDEX IDX_ED925F02AB7B5A55 ON inwicast_plugin_media (widgetInstance_id)
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_ED925F02B87FAB32 ON inwicast_plugin_media (resourceNode_id)
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediacenter (
                id NUMBER(10) NOT NULL, 
                url VARCHAR2(255) NOT NULL, 
                resourceNode_id NUMBER(10) DEFAULT NULL, 
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
            CREATE SEQUENCE INWICAST_PLUGIN_MEDIACENTER_ID_SEQ START WITH 1 MINVALUE 1 INCREMENT BY 1
        ");
        $this->addSql("
            CREATE TRIGGER INWICAST_PLUGIN_MEDIACENTER_AI_PK BEFORE INSERT ON INWICAST_PLUGIN_MEDIACENTER FOR EACH ROW DECLARE last_Sequence NUMBER; last_InsertID NUMBER; BEGIN 
            SELECT INWICAST_PLUGIN_MEDIACENTER_ID_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; IF (
                : NEW.ID IS NULL 
                OR : NEW.ID = 0
            ) THEN 
            SELECT INWICAST_PLUGIN_MEDIACENTER_ID_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; ELSE 
            SELECT NVL(Last_Number, 0) INTO last_Sequence 
            FROM User_Sequences 
            WHERE Sequence_Name = 'INWICAST_PLUGIN_MEDIACENTER_ID_SEQ'; 
            SELECT : NEW.ID INTO last_InsertID 
            FROM DUAL; WHILE (last_InsertID > last_Sequence) LOOP 
            SELECT INWICAST_PLUGIN_MEDIACENTER_ID_SEQ.NEXTVAL INTO last_Sequence 
            FROM DUAL; END LOOP; END IF; END;
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_10878E9B87FAB32 ON inwicast_plugin_mediacenter (resourceNode_id)
        ");
        $this->addSql("
            CREATE TABLE inwicast_plugin_mediauser (
                id NUMBER(10) NOT NULL, 
                user_id NUMBER(10) DEFAULT NULL, 
                username VARCHAR2(255) NOT NULL, 
                resourceNode_id NUMBER(10) DEFAULT NULL, 
                PRIMARY KEY(id)
            )
        ");
        $this->addSql("
            DECLARE constraints_Count NUMBER; BEGIN 
            SELECT COUNT(CONSTRAINT_NAME) INTO constraints_Count 
            FROM USER_CONSTRAINTS 
            WHERE TABLE_NAME = 'INWICAST_PLUGIN_MEDIAUSER' 
            AND CONSTRAINT_TYPE = 'P'; IF constraints_Count = 0 
            OR constraints_Count = '' THEN EXECUTE IMMEDIATE 'ALTER TABLE INWICAST_PLUGIN_MEDIAUSER ADD CONSTRAINT INWICAST_PLUGIN_MEDIAUSER_AI_PK PRIMARY KEY (ID)'; END IF; END;
        ");
        $this->addSql("
            CREATE SEQUENCE INWICAST_PLUGIN_MEDIAUSER_ID_SEQ START WITH 1 MINVALUE 1 INCREMENT BY 1
        ");
        $this->addSql("
            CREATE TRIGGER INWICAST_PLUGIN_MEDIAUSER_AI_PK BEFORE INSERT ON INWICAST_PLUGIN_MEDIAUSER FOR EACH ROW DECLARE last_Sequence NUMBER; last_InsertID NUMBER; BEGIN 
            SELECT INWICAST_PLUGIN_MEDIAUSER_ID_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; IF (
                : NEW.ID IS NULL 
                OR : NEW.ID = 0
            ) THEN 
            SELECT INWICAST_PLUGIN_MEDIAUSER_ID_SEQ.NEXTVAL INTO : NEW.ID 
            FROM DUAL; ELSE 
            SELECT NVL(Last_Number, 0) INTO last_Sequence 
            FROM User_Sequences 
            WHERE Sequence_Name = 'INWICAST_PLUGIN_MEDIAUSER_ID_SEQ'; 
            SELECT : NEW.ID INTO last_InsertID 
            FROM DUAL; WHILE (last_InsertID > last_Sequence) LOOP 
            SELECT INWICAST_PLUGIN_MEDIAUSER_ID_SEQ.NEXTVAL INTO last_Sequence 
            FROM DUAL; END LOOP; END IF; END;
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_DDB60112A76ED395 ON inwicast_plugin_mediauser (user_id)
        ");
        $this->addSql("
            CREATE UNIQUE INDEX UNIQ_DDB60112B87FAB32 ON inwicast_plugin_mediauser (resourceNode_id)
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_media 
            ADD CONSTRAINT FK_ED925F02AB7B5A55 FOREIGN KEY (widgetInstance_id) 
            REFERENCES claro_widget_instance (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_media 
            ADD CONSTRAINT FK_ED925F02B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_mediacenter 
            ADD CONSTRAINT FK_10878E9B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_mediauser 
            ADD CONSTRAINT FK_DDB60112A76ED395 FOREIGN KEY (user_id) 
            REFERENCES claro_user (id)
        ");
        $this->addSql("
            ALTER TABLE inwicast_plugin_mediauser 
            ADD CONSTRAINT FK_DDB60112B87FAB32 FOREIGN KEY (resourceNode_id) 
            REFERENCES claro_resource_node (id) 
            ON DELETE CASCADE
        ");
    }

    public function down(Schema $schema)
    {
        $this->addSql("
            DROP TABLE inwicast_plugin_media
        ");
        $this->addSql("
            DROP TABLE inwicast_plugin_mediacenter
        ");
        $this->addSql("
            DROP TABLE inwicast_plugin_mediauser
        ");
    }
}