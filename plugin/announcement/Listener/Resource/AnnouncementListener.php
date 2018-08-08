<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AnnouncementBundle\Listener\Resource;

use Claroline\AnnouncementBundle\Entity\AnnouncementAggregate;
use Claroline\AnnouncementBundle\Manager\AnnouncementManager;
use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\User\RoleSerializer;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Ramsey\Uuid\Uuid;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\HttpFoundation\Response;

/**
 * @DI\Service()
 */
class AnnouncementListener
{
    /** @var ObjectManager */
    private $om;
    /** @var TwigEngine */
    private $templating;
    /** @var AnnouncementManager */
    private $manager;
    /** @var RoleSerializer */
    private $roleSerializer;
    /** @var Crud */
    private $crud;

    /**
     * AnnouncementListener constructor.
     *
     * @DI\InjectParams({
     *     "om"             = @DI\Inject("claroline.persistence.object_manager"),
     *     "templating"     = @DI\Inject("templating"),
     *     "manager"        = @DI\Inject("claroline.manager.announcement_manager"),
     *     "roleSerializer" = @DI\Inject("claroline.serializer.role"),
     *     "crud"           = @DI\Inject("claroline.api.crud")
     * })
     *
     * @param ObjectManager       $om
     * @param TwigEngine          $templating
     * @param AnnouncementManager $manager
     * @param RoleSerializer      $roleSerializer,
     * @param Crud                $crud
     */
    public function __construct(
        ObjectManager $om,
        TwigEngine $templating,
        AnnouncementManager $manager,
        RoleSerializer $roleSerializer,
        Crud $crud
    ) {
        $this->om = $om;
        $this->templating = $templating;
        $this->manager = $manager;
        $this->roleSerializer = $roleSerializer;
        $this->crud = $crud;
    }

    /**
     * @DI\Observe("delete_claroline_announcement_aggregate")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_claroline_announcement_aggregate")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        $resource = $event->getResource();
        $serializedRoles = [];
        $roles = $resource->getResourceNode()->getWorkspace()->getRoles()->toArray();

        foreach ($roles as $role) {
            $serializedRoles[] = $this->roleSerializer->serialize($role);
        }

        $content = $this->templating->render(
            'ClarolineAnnouncementBundle:announcement:open.html.twig', [
                '_resource' => $resource,
                'roles' => $serializedRoles,
            ]
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("copy_claroline_announcement_aggregate")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        /** @var AnnouncementAggregate $aggregate */
        $aggregate = $event->getResource();

        $this->om->startFlushSuite();
        $copy = new AnnouncementAggregate();
        $this->om->persist($copy);

        $announcements = $aggregate->getAnnouncements();

        foreach ($announcements as $announcement) {
            $newAnnouncement = $this->manager->serialize($announcement);
            $newAnnouncement['id'] = Uuid::uuid4()->toString();
            $this->crud->create('Claroline\AnnouncementBundle\Entity\Announcement', $newAnnouncement, [
              'announcement_aggregate' => $copy,
              Options::NO_LOG => Options::NO_LOG,
            ]);
        }

        $this->om->endFlushSuite();

        $event->setCopy($copy);
        $event->stopPropagation();
    }
}
