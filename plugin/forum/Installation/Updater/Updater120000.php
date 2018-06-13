<?php

namespace Claroline\ForumBundle\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class Updater120000 extends Updater
{
    private $container;
    /** @var Connection */
    private $conn;

    public function __construct($container)
    {
        $this->container = $container;
        $this->conn = $container->get('doctrine.dbal.default_connection');
    }

    public function preUpdate()
    {
        //trouver une vraie condition plus tard
        if (true) {
            //backup des tables just in case
            $this->log('backing up the forum subjects...');
            $this->conn->query('CREATE TABLE claro_forum_subject_tempnew AS (SELECT * FROM claro_forum_subject)');
            $this->log('backing up the forum messages...');
            $this->conn->query('CREATE TABLE claro_forum_message_tempnew AS (SELECT * FROM claro_forum_message)');
            $this->log('backing up the forum categories...');
            $this->conn->query('CREATE TABLE claro_forum_category_tempnew AS (SELECT * FROM claro_forum_category)');
        }

        //trouver une autre condition toussa
        if (true) {
            //faire la migration !!!
        }
    }

    public function postUpdate()
    {
    }
}
