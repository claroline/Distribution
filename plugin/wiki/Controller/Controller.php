<?php

namespace Icap\WikiBundle\Controller;

use Claroline\CoreBundle\Event\Log\LogResourceChildUpdateEvent;
use Claroline\CoreBundle\Event\Log\LogResourceReadEvent;
use Claroline\CoreBundle\Event\Log\LogResourceUpdateEvent;
use Claroline\CoreBundle\Library\Resource\ResourceCollection;
use Icap\WikiBundle\Entity\Contribution;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Entity\Wiki;
use Icap\WikiBundle\Event\Log\LogContributionCreateEvent;
use Icap\WikiBundle\Event\Log\LogSectionCreateEvent;
use Icap\WikiBundle\Event\Log\LogSectionDeleteEvent;
use Icap\WikiBundle\Event\Log\LogSectionMoveEvent;
use Icap\WikiBundle\Event\Log\LogSectionRemoveEvent;
use Icap\WikiBundle\Event\Log\LogSectionRestoreEvent;
use Icap\WikiBundle\Event\Log\LogSectionUpdateEvent;
use Icap\WikiBundle\Event\Log\LogWikiConfigureEvent;
use Symfony\Bundle\FrameworkBundle\Controller\Controller as BaseController;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class Controller extends BaseController
{
    const WIKI_TYPE = 'icap_wiki';
    const WIKI_SECTION_TYPE = 'icap_wiki_section';

    /**
     * @param string $permission
     * @param Wiki   $wiki
     *
     * @throws AccessDeniedException
     */
    protected function checkAccess($permission, Wiki $wiki)
    {
        $collection = new ResourceCollection([$wiki->getResourceNode()]);
        if (!$this->get('security.authorization_checker')->isGranted($permission, $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }

        $logEvent = new LogResourceReadEvent($wiki->getResourceNode());
        $this->get('event_dispatcher')->dispatch('log', $logEvent);
    }

    /**
     * @param string $permission
     * @param Wiki   $wiki
     *
     * @return bool
     */
    public function isUserGranted($permission, Wiki $wiki, $collection = null)
    {
        if ($collection === null) {
            $collection = new ResourceCollection([$wiki->getResourceNode()]);
        }
        $checkPermission = false;
        if ($this->get('security.authorization_checker')->isGranted($permission, $collection)) {
            $checkPermission = true;
        }

        return $checkPermission;
    }

    /**
     * @param $event
     *
     * @return Controller
     */
    protected function dispatch($event)
    {
        $this->get('event_dispatcher')->dispatch('log', $event);

        return $this;
    }

    /**
     * Retrieve logged user. If anonymous return null.
     *
     * @return user
     */
    protected function getLoggedUser()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if (is_string($user)) {
            $user = null;
        }

        return $user;
    }
}
