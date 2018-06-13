<?php

namespace Claroline\ForumBundle\Installation\Updater;

use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\InstallationBundle\Updater\Updater;
use Doctrine\DBAL\Connection;

class Updater120000 extends Updater
{
    private $container;
    /** @var Connection */
    private $conn;
    private $om;

    public function __construct($container)
    {
        $this->container = $container;
        $this->conn = $container->get('doctrine.dbal.default_connection');
        $this->om = $container->get('claroline.persistence.object_manager');
    }

    public function preUpdate()
    {
        try {
            $this->log('backing up the forum subjects...');
            $this->conn->query('CREATE TABLE claro_forum_subject_temp_new  AS (SELECT * FROM claro_forum_subject)');
        } catch (\Exception $e) {
            $this->log('Coulnt backup forum subjects');
        }
    }

    public function postUpdate()
    {
        //trouver une autre condition toussa
        if (true) {
            $this->log('restoring the categories as tag...');

            $sql = 'SELECT * FROM claro_forum_subject_temp_new ';
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();

            foreach ($stmt->fetchAll() as $rowSubject) {
                $this->log('Restoring category as tag for subject '.$rowSubject['title'].'...');
                $this->restoreSubjectCategory($rowSubject);
            }
        }
    }

    private function restoreSubjectCategory(array $subject)
    {
        $currentSubject = $this->om->getRepository('Claroline\ForumBundle\Entity\Subject')->find($subject['id']);

        $sql = 'SELECT * FROM claro_forum_category where id =  '.$subject['category_id'];
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $category = $stmt->fetch();
        $forum = $this->om->getRepository('Claroline\ForumBundle\Entity\Forum')->find($category['forum_id']);

        $currentSubject->setForum($forum);
        $this->om->persist($currentSubject);

        $event = new GenericDataEvent([
            'tags' => [$category['name']],
            'data' => [
                [
                    'class' => 'Claroline\ForumBundle\Entity\Subject',
                    'id' => $currentSubject->getUuid(),
                    'name' => $currentSubject->getTitle(),
                ],
            ],
            'replace' => true,
        ]);

        $this->container->get('event_dispatcher')->dispatch('claroline_tag_multiple_data', $event);
    }
}
