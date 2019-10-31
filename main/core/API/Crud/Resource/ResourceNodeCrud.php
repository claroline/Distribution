<?php

namespace Claroline\CoreBundle\API\Crud\Resource;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Event\Crud\CreateEvent;
use Claroline\AppBundle\Event\Crud\DeleteEvent;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Manager\Resource\ResourceLifecycleManager;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * @todo manage correct renaming : see $this->resourceManager->rename($resourceNode, $data['name'], true);
 * @todo correct manage publication see : $this->resourceManager->setPublishedStatus([$resourceNode], $meta['published']);
 */
class ResourceNodeCrud
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /**
     * ResourceNodeCrud constructor.
     *
     * @param TokenStorageInterface $tokenStorage
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        ObjectManager $om,
        Crud $crud,
        StrictDispatcher $dispatcher,
        ResourceLifecycleManager $lifeCycleManager,
        $filesDirectory
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->om = $om;
        $this->crud = $crud;
        $this->dispatcher = $dispatcher;
        $this->lifeCycleManager = $lifeCycleManager;
        $this->filesDirectory = $filesDirectory;
    }

    /**
     * @param CreateEvent $event
     *
     * @return ResourceNode
     */
    public function preCreate(CreateEvent $event)
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $event->getObject();

        // set the creator of the resource
        $user = $this->tokenStorage->getToken()->getUser();
        if ($user instanceof User) {
            $resourceNode->setCreator($user);
        }

        return $resourceNode;
    }

    /**
     * @param DeleteEvent $event
     *
     * @return ResourceNode
     */
    public function preDelete(DeleteEvent $event)
    {
        $node = $event->getObject();
        $options = $event->getOptions();
        $softDelete = in_array(Options::SOFT_DELETE, $options);

        if (null === $node->getParent()) {
            throw new \LogicException('Root directory cannot be removed');
        }

        $workspace = $node->getWorkspace();
        $nodes = $this->om->getRepository(ResourceNode::class)->findDescendants($node);
        $nodes[] = $node;
        $this->om->startFlushSuite();

        foreach ($nodes as $node) {
            $resource = $this->getResourceFromNode($node);
            /*
             * resChild can be null if a shortcut was removed
             *
             * activities must be ignored atm
             */

            $ignore = ['activity'];

            if (null !== $resource) {
                if (!$softDelete && !in_array($node->getResourceType()->getName(), $ignore)) {
                    $event = $this->lifeCycleManager->delete($node);

                    foreach ($event->getFiles() as $file) {
                        if ($softDelete) {
                            $parts = explode(
                              $this->filesDirectory.DIRECTORY_SEPARATOR,
                              $file
                          );

                            if (2 === count($parts)) {
                                $deleteDir = $this->filesDirectory.
                                  DIRECTORY_SEPARATOR.
                                  'DELETED_FILES';
                                $dest = $deleteDir.
                                  DIRECTORY_SEPARATOR.
                                  $parts[1];
                                $additionalDirs = explode(DIRECTORY_SEPARATOR, $parts[1]);

                                for ($i = 0; $i < count($additionalDirs) - 1; ++$i) {
                                    $deleteDir .= DIRECTORY_SEPARATOR.$additionalDirs[$i];
                                }

                                if (!is_dir($deleteDir)) {
                                    mkdir($deleteDir, 0777, true);
                                }
                                rename($file, $dest);
                            }
                        } else {
                            unlink($file);
                        }

                        //It won't work if a resource has no workspace for a reason or an other. This could be a source of bug.
                        $dir = $this->filesDirectory.
                          DIRECTORY_SEPARATOR.
                          'WORKSPACE_'.
                          $workspace->getId();

                        if (is_dir($dir) && $this->isDirectoryEmpty($dir)) {
                            rmdir($dir);
                        }
                    }
                }

                if ($softDelete) {
                    $node->setActive(false);
                    // Rename node to allow future nodes have the same name
                    $node->setName($node->getName().uniqid('_'));
                    $this->om->persist($node);
                } else {
                    //for tags
                    $this->dispatcher->dispatch(
                      'claroline_resources_delete',
                      'GenericData',
                      [[$node]]
                  );

                    /*
                     * If the child isn't removed here aswell, doctrine will fail to remove $resChild
                     * because it still has $resChild in its UnitOfWork or something (I have no idea
                     * how doctrine works tbh). So if you remove this line the suppression will
                     * not work for directory containing children.
                     */
                    $this->om->remove($resource);
                }
                //resource already doesn't exist anymore so we just remove everything
            } else {
                $this->om->remove($node);
                //for tags
                $this->dispatcher->dispatch(
                    'claroline_resources_delete',
                    'GenericData',
                    [[$node]]
                );
            }
        }

        $this->om->endFlushSuite();
    }

    /**
     * Returns the resource linked to a node.
     *
     * @param ResourceNode $node
     *
     * @return AbstractResource
     */
    public function getResourceFromNode(ResourceNode $node)
    {
        try {
            /* @var AbstractResource $resource */
            $resource = $this->om->getRepository($node->getClass())->findOneBy(['resourceNode' => $node]);

            return $resource;
        } catch (\Exception $e) {
            $this->log('class '.$node->getClass().' doesnt exists', 'error');
        }
    }
}
