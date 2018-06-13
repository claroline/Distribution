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
        $this->om = $container->get('claroline.persistence.object_manager')
    }

    public function preUpdate()
    {
        //trouver une autre condition toussa
        if (true) {
            $this->log('restoring the categories as tag...');
            $forums = $this->om->getRepository('ClarolineForumBundle:Forum')->findAll();
            $sql = 'SELECT * FROM claro_forum_category WHERE forum_id = :forumId';
            $stmt = $this->conn->prepare($sql);

            foreach ($forums as $forum) {
                foreach ($stmt->fetchAll() as $rowCategory) {
                  $this->log('Restoring category as tag for ' . $rowCategory['name']);
                    $this->buildCategoryFromTag($rowCategory);
                }
            }
        }
    }

    private function buildCategoryFromTag(array $category)
    {
        $subject = $this->om->getRepository('Claroline\ForumBundle\Entity\Subject')->find($category['subject_id']);

        $event = new GenericDataEvent([
            'tags' => [$category['name']],
            'data' => [
                [
                    'class' => 'Claroline\ForumBundle\Entity\Subject',
                    'id' => $subject->getUuid(),
                    'name' => $subject->getTitle(),
                ],
            ],
            'replace' => true,
        ]);

        $this->container->get('event_dispatcher')->dispatch('claroline_tag_multiple_data', $event);
    }

    public function postUpdate()
    {
    }
}
