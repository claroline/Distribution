<?php

namespace Claroline\CoreBundle\API\Serializer\Tool\Types;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\CoreBundle\Entity\Tab\HomeTab;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.tool.home")
 *
 * Not a true Serializer I guess. Move this elsewhere ?
 */
class HomeSerializer
{
    /**
     * WorkspaceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "serializer"   = @DI\Inject("claroline.api.serializer"),
     *     "finder"       = @DI\Inject("claroline.api.finder"),
     *     "crud"         = @DI\Inject("claroline.api.crud")
     * })
     *

     * @param SerializerProvider $serializer
     */
    public function __construct(
          SerializerProvider $serializer,
          FinderProvider $finder,
          Crud $crud
      ) {
        $this->serializer = $serializer;
        $this->finder = $finder;
        $this->crud = $crud;
    }

    use SerializerTrait;

    /**
     * @return array
     */
    public function serialize(Workspace $workspace): array
    {
        $tabs = $this->finder->search(HomeTab::class, [
            'filters' => ['workspace' => $workspace->getUuid()],
        ]);

        // but why ? finder should never give you an empty row
        $tabs = array_filter($tabs['data'], function ($data) {
            return $data !== [];
        });

        return ['tabs' => $tabs];
    }

    public function deserialize(array $data, Workspace $workspace)
    {
        foreach ($data['tabs'] as $tab) {
            // do not update tabs set by the administration tool
            $new = $this->crud->update(HomeTab::class, $tab);
            $new->setWorkspace($workspace);

            //a voir plus tard
            foreach ($tab['widgets'] as $container) {
                $containerIds[] = $container['id'];
                foreach ($container['contents'] as $instance) {
                    $instanceIds[] = $instance['id'];
                }
            }
        }
    }
}
