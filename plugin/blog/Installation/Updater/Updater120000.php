<?php

namespace Icap\BlogBundle\Installation\Updater;

use Claroline\InstallationBundle\Updater\Updater;

class Updater120000 extends Updater
{
    private $container;

    public function __construct($container)
    {
        $this->container = $container;
    }

    public function postUpdate()
    {
        //migrate blog tags to tabBUndle tags
        $this->migrateTags();
        //set new CommentModerationMode attribute value
        $this->setCommentModerationMode();
        //drop old tag blog table
    }

    private function migrateTags()
    {
        $this->log('Transfer blog tags to tagBundle');
        $om = $this->container->get('claroline.persistence.object_manager');
        $serializer = $this->container->get('claroline.serializer.blog.post');
        $repo = $om->getRepository('Icap\BlogBundle\Entity\Post');

        $batchSize = 1000;
        $i = 0;
        $om->startFlushSuite();
        $page = 1;
        $posts = [];
        while (1 === $page || count($posts) >= $batchSize) {
            //get batch
            $posts = $repo->findBy([], ['id' => 'ASC'], $batchSize, $batchSize * ($page - 1));
            foreach ($posts as $post) {
                $serializer->deserializeTags($post, $post->getTags()->toArray());
                ++$i;
                if (0 === $i % 200) {
                    $om->forceFlush();
                }
            }
            ++$page;
        }

        $om->endFlushSuite();
    }

    private function setCommentModerationMode()
    {
        $this->log('Updating new commentModerationMode attribute from old autoPublishComment');
        $om = $this->container->get('claroline.persistence.object_manager');
        $repo = $om->getRepository('Icap\BlogBundle\Entity\BlogOptions');
        $options = $repo->findAll();
        $i = 0;

        $om->startFlushSuite();

        foreach ($options as $options) {
            if (is_null($options->getCommentModerationMode())) {
                $options->setCommentModerationMode($options->getAutoPublishComment() ? 0 : 2);
                ++$i;
                if (0 === $i % 200) {
                    $om->forceFlush();
                }
            }
        }

        $om->endFlushSuite();
    }
}
