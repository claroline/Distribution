<?php

namespace Claroline\CoreBundle\Listener\DataSource;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\Tool\AdminTool;
use Claroline\CoreBundle\Event\DataSource\GetDataEvent;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class AdminToolSource
{
    /** @var FinderProvider */
    private $finder;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * AdminToolSource constructor.
     */
    public function __construct(FinderProvider $finder, TokenStorageInterface $tokenStorage)
    {
        $this->finder = $finder;
        $this->tokenStorage = $tokenStorage;
    }

    public function getData(GetDataEvent $event)
    {
        $options = $event->getOptions();
        $user = $this->tokenStorage->getToken()->getUser();
        $roles = 'anon.' === $user ?
            ['ROLE_ANONYMOUS'] :
            $user->getRoles();

        if (!in_array('ROLE_ADMIN', $roles)) {
            $options['hiddenFilters']['roles'] = $roles;
        }

        $event->setData($this->finder->search(AdminTool::class, $options));
        $event->stopPropagation();
    }
}
