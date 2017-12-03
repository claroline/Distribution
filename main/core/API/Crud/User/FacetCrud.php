<?php

namespace Claroline\CoreBundle\API\Crud\User;

use Claroline\CoreBundle\Event\CrudEvent;
use Claroline\CoreBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.crud.facet")
 * @DI\Tag("claroline.crud")
 */
class FacetCrud
{
    /** @var ObjectManager */
    private $om;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ContainerInterface $container
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;
    }

    /**
     * @DI\Observe("crud_post_create_object_claroline_corebundle_entity_facet_facet")
     *
     * @param CrudEvent $event
     */
    public function postCreate(CrudEvent $event)
    {
        $this->removeOrphans();
    }

    /**
     * @DI\Observe("crud_post_update_object_claroline_corebundle_entity_facet_facet")
     *
     * @param CrudEvent $event
     */
    public function postUpdate(CrudEvent $event)
    {
        $this->removeOrphans();
    }

    private function removeOrphans()
    {
        $orphans = $this->om->getRepository('ClarolineCoreBundle:Facet\PanelFacet')
          ->findBy(['facet' => null]);

        foreach ($orphans as $orphan) {
            $this->om->remove($orphan);
        }

        $orphans = $this->om->getRepository('ClarolineCoreBundle:Facet\FieldFacet')
          ->findBy(['panelFacet' => null]);

        foreach ($orphans as $orphan) {
            $this->om->remove($orphan);
        }

        $this->om->flush();
    }
}
