<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Workspace\Transfer\Resources;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Event\ImportObjectEvent;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

/**
 * @DI\Service
 */
class Listener
{
    /**
     * ResourceNodeManager constructor.
     *
     * @DI\InjectParams({
     *     "filesDir"     = @DI\Inject("%claroline.param.files_directory%"),
     *     "finder"       = @DI\Inject("claroline.api.finder"),
     *     "crud"         = @DI\Inject("claroline.api.crud"),
     *     "tokenStorage" = @DI\Inject("security.token_storage"),
     *     "dispatcher"   = @DI\Inject("claroline.event.event_dispatcher"),
     *     "om"           = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param RouterInterface $router
     */
    public function __construct(
        $filesDir,
        FinderProvider $finder,
        Crud $crud,
        TokenStorage $tokenStorage,
        StrictDispatcher $dispatcher,
        ObjectManager $om
    ) {
        $this->filesDir = $filesDir;
        $this->om = $om;
        $this->finder = $finder;
        $this->crud = $crud;
        $this->tokenStorage = $tokenStorage;
        $this->dispatcher = $dispatcher;
    }

    /**
     * @DI\Observe("transfer_import_claroline_corebundle_entity_resource_file")
     */
    public function onImportFile(ImportObjectEvent $event)
    {
        $data = $event->getData();
        $bag = $event->getFileBag();
        $fileSystem = new Filesystem();
        try {
            $fileSystem->rename($bag->get($data['_path']), $this->filesDir.DIRECTORY_SEPARATOR.$data['hashName']);
        } catch (\Exception $e) {
        }
        //move filebags elements here
    }

    /**
     * @DI\Observe("transfer_import_claroline_corebundle_entity_resource_resourcenode")
     */
    public function onImportResourceNode(ImportObjectEvent $event)
    {
        $data = $event->getData();

        if (isset($data['resource'])) {
            $type = $data['meta']['type'];
            $resourceType = $this->om->getRepository(ResourceType::class)->findOneByName($type);
            $this->dispatcher->dispatch(
                'transfer_import_'.$this->getUnderscoreClassName($resourceType->getClass()),
                'Claroline\\CoreBundle\\Event\\ImportObjectEvent',
                [$event->getFileBag(), $data['resource']]
            );
        }

        if (isset($data['children'])) {
            foreach ($data['children'] as $child) {
                $recursive = new ImportObjectEvent($event->getFileBag(), $child);
                $this->onImportResourceNode($recursive);
            }
        }
    }

    private function getUnderscoreClassName($className)
    {
        return strtolower(str_replace('\\', '_', $className));
    }
}
