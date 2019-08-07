<?php

namespace Claroline\OpenBadgeBundle\Crud;

use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\CoreBundle\API\Serializer\ParametersSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @DI\Service("claroline.crud.open_badge.badge")
 * @DI\Tag("claroline.crud")
 */
class BadgeClassCrud
{
    /** @var ParametersSerializer */
    private $parametersSerializer;

    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * TemplateSerializer constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"  = @DI\Inject("security.token_storage"),
     *     "parametersSerializer" = @DI\Inject("claroline.serializer.parameters")
     * })
     *
     * @param ParametersSerializer $parametersSerializer
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        ParametersSerializer $parametersSerializer
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->parametersSerializer = $parametersSerializer;
    }

    /**
     * @DI\Observe("crud_pre_create_object_claroline_openbadgebundle_entity_badgeclass")
     *
     * @param CreateEvent $event
     */
    public function preCreate(CreateEvent $event)
    {
        $badge = $event->getObject();
        $badge->setIssuer($this->tokenStorage->getToken()->getUser()->getMainOrganization());

        if ($badge->getWorkspace()) {
            $badge->setEnabled($this->parametersSerializer->serialize()['badges']['enable_default']);
        }
    }
}
