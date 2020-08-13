<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\AppBundle\API\Crud;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Event\StrictDispatcher;
use Claroline\AppBundle\Manager\File\TempFileManager;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\Resource\ResourceType;
use Claroline\CoreBundle\Entity\Role;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\Resource\DownloadResourceEvent;
use Claroline\CoreBundle\Event\Resource\LoadResourceEvent;
use Claroline\CoreBundle\Exception\ExportResourceException;
use Claroline\CoreBundle\Exception\ResourceMoveException;
use Claroline\CoreBundle\Exception\ResourceNotFoundException;
use Claroline\CoreBundle\Exception\ResourceTypeNotFoundException;
use Claroline\CoreBundle\Library\Utilities\ClaroUtilities;
use Claroline\CoreBundle\Manager\Resource\RightsManager;
use Claroline\CoreBundle\Repository\ResourceNodeRepository;
use Claroline\CoreBundle\Repository\ResourceTypeRepository;
use Claroline\CoreBundle\Repository\RoleRepository;
use Doctrine\ORM\NonUniqueResultException;
use Doctrine\ORM\NoResultException;
use Symfony\Component\HttpFoundation\File\MimeType\ExtensionGuesser;
use Symfony\Component\HttpFoundation\File\MimeType\MimeTypeGuesser;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

class ResourceManager
{
    use LoggableTrait;

    /** @var AuthorizationCheckerInterface */
    private $authorization;
    /** @var StrictDispatcher */
    private $dispatcher;
    /** @var ObjectManager */
    private $om;
    /** @var ClaroUtilities */
    private $ut;
    /** @var Crud */
    private $crud;
    /** @var RightsManager */
    private $rightsManager;
    /** @var TempFileManager */
    private $tempManager;

    /** @var ResourceTypeRepository */
    private $resourceTypeRepo;
    /** @var ResourceNodeRepository */
    private $resourceNodeRepo;
    /** @var RoleRepository */
    private $roleRepo;

    /**
     * ResourceManager constructor.
     *
     * @param AuthorizationCheckerInterface $authorization
     * @param RightsManager                 $rightsManager
     * @param StrictDispatcher              $dispatcher
     * @param ObjectManager                 $om
     * @param ClaroUtilities                $ut
     * @param Crud                          $crud
     * @param TempFileManager               $tempManager
     * @param ResourceNodeRepository        $resourceNodeRepo
     */
    public function __construct(
        AuthorizationCheckerInterface $authorization,
        RightsManager $rightsManager,
        StrictDispatcher $dispatcher,
        ObjectManager $om,
        ClaroUtilities $ut,
        Crud $crud,
        TempFileManager $tempManager,
        ResourceNodeRepository $resourceNodeRepo
    ) {
        $this->authorization = $authorization;
        $this->om = $om;
        $this->rightsManager = $rightsManager;
        $this->dispatcher = $dispatcher;
        $this->ut = $ut;
        $this->crud = $crud;
        $this->tempManager = $tempManager;
        $this->resourceNodeRepo = $resourceNodeRepo;

        $this->resourceTypeRepo = $om->getRepository(ResourceType::class);
        $this->roleRepo = $om->getRepository(Role::class);
    }

    public function getLogger()
    {
        return $this->logger;
    }

    /**
     * Creates a resource.
     *
     * array $rights should be defined that way:
     * array('ROLE_WS_XXX' => array('open' => true, 'edit' => false, ...
     * 'create' => array('directory', ...), 'role' => $entity))
     *
     * @param AbstractResource $resource
     * @param ResourceType     $resourceType
     * @param User             $creator
     * @param Workspace        $workspace
     * @param ResourceNode     $parent
     * @param array            $rights
     * @param bool             $isPublished
     * @param bool             $createRights
     *
     * @deprecated: use directory listener: onAdd instead ? I don't know. This is weird.
     *
     * @return AbstractResource
     */
    public function create(
        AbstractResource $resource,
        ResourceType $resourceType,
        User $creator,
        Workspace $workspace = null,
        ResourceNode $parent = null,
        array $rights = [],
        $isPublished = true,
        $createRights = true
    ) {
        $this->om->startFlushSuite();
        /** @var ResourceNode $node */
        $node = new ResourceNode();
        $node->setResourceType($resourceType);
        $node->setPublished($isPublished);
        $mimeType = (null === $resource->getMimeType()) ?
            'custom/'.$resourceType->getName() :
            $resource->getMimeType();
        $node->setMimeType($mimeType);
        $node->setName($resource->getName());
        $node->setCreator($creator);
        if (!$workspace && $parent && $parent->getWorkspace()) {
            $workspace = $parent->getWorkspace();
        }
        if ($workspace) {
            $node->setWorkspace($workspace);
        }
        $node->setParent($parent);
        $node->setName($this->getUniqueName($node, $parent));
        if ($parent) {
            $this->setLastIndex($parent, $node);
        }
        if (!is_null($parent)) {
            $node->setAccessibleFrom($parent->getAccessibleFrom());
            $node->setAccessibleUntil($parent->getAccessibleUntil());
        }
        $resource->setResourceNode($node);
        if ($createRights) {
            $this->setRights($node, $parent, $rights);
        }
        $this->om->persist($node);
        $this->om->persist($resource);
        $parentPath = '';
        if ($parent) {
            $parentPath .= $parent->getPathForDisplay().' / ';
        }
        $node->setPathForCreationLog($parentPath.$node->getName());
        $this->om->endFlushSuite();

        return $resource;
    }

    /**
     * Gets a unique name for a resource in a folder.
     * If the name of the resource already exists here, ~*indice* will be appended
     * to its name.
     *
     * @param ResourceNode $node
     * @param ResourceNode $parent
     * @param bool         $isCopy
     *
     * @return string
     */
    public function getUniqueName(ResourceNode $node, ResourceNode $parent = null, $isCopy = false)
    {
        $candidateName = $node->getName();
        $nodeType = $node->getResourceType();
        //if the parent is null, then it's a workspace root and the name is always correct
        //otherwise we fetch each workspace root with the findBy and the UnitOfWork won't be happy...
        if (!$parent) {
            return $candidateName;
        }

        $parent = $parent ?: $node->getParent();
        $sameLevelNodes = $parent ?
            $parent->getChildren() :
            $this->resourceNodeRepo->findBy(['parent' => null]);
        $siblingNames = [];

        foreach ($sameLevelNodes as $levelNode) {
            if (!$isCopy && $levelNode === $node) {
                // without that condition, a node which is "renamed" with the
                // same name is also incremented
                continue;
            }
            if ($levelNode->getResourceType() === $nodeType) {
                $siblingNames[] = $levelNode->getName();
            }
        }

        if (!in_array($candidateName, $siblingNames)) {
            return $candidateName;
        }

        $candidateRoot = pathinfo($candidateName, PATHINFO_FILENAME);
        $candidateExt = ($ext = pathinfo($candidateName, PATHINFO_EXTENSION)) ? '.'.$ext : '';
        $candidatePattern = '/^'
            .preg_quote($candidateRoot)
            .'~(\d+)'
            .preg_quote($candidateExt)
            .'$/';
        $previousIndex = 0;

        foreach ($siblingNames as $name) {
            $matches = [];
            if (preg_match($candidatePattern, $name, $matches) && $matches[1] > $previousIndex) {
                $previousIndex = $matches[1];
            }
        }

        return $candidateRoot.'~'.++$previousIndex.$candidateExt;
    }

    /**
     * Create the rights for a node.
     *
     * array $rights should be defined that way:
     * array('ROLE_WS_XXX' => array('open' => true, 'edit' => false, ...
     * 'create' => array('directory', ...), 'role' => $entity))
     *
     * @param ResourceNode $node
     * @param array        $rights
     * @param bool         $withDefault
     * @param bool         $log
     */
    public function createRights(ResourceNode $node, array $rights = [], $withDefault = true, $log = true)
    {
        foreach ($rights as $data) {
            $resourceTypes = $this->checkResourceTypes($data['create']);
            $this->rightsManager->create($data, $data['role'], $node, false, $resourceTypes, $log);
        }

        if ($withDefault) {
            if (!array_key_exists('ROLE_ANONYMOUS', $rights)) {
                /** @var Role $anonymous */
                $anonymous = $this->roleRepo->findOneBy(['name' => 'ROLE_ANONYMOUS']);

                $this->rightsManager->create(0, $anonymous, $node, false, [], $log);
            }

            if (!array_key_exists('ROLE_USER', $rights)) {
                /** @var Role $user */
                $user = $this->roleRepo->findOneBy(['name' => 'ROLE_USER']);

                $this->rightsManager->create(0, $user, $node, false, [], $log);
            }
        }
    }

    /**
     * Moves a resource.
     *
     * @param ResourceNode $child  currently treated node
     * @param ResourceNode $parent old parent
     *
     * @throws ResourceMoveException
     *
     * @return ResourceNode
     */
    public function move(ResourceNode $child, ResourceNode $parent)
    {
        if ($parent === $child) {
            throw new ResourceMoveException('You cannot move a directory into itself');
        }

        $descendants = $this->resourceNodeRepo->findDescendants($child);
        foreach ($descendants as $descendant) {
            if ($parent === $descendant) {
                throw new ResourceMoveException('You cannot move a directory into its descendants');
            }
        }

        $this->om->startFlushSuite();
        $this->setLastIndex($parent, $child);
        $child->setParent($parent);
        $child->setName($this->getUniqueName($child, $parent));

        if ($child->getWorkspace()->getId() !== $parent->getWorkspace()->getId()) {
            $this->updateWorkspace($child, $parent->getWorkspace());
        }

        $this->om->persist($child);
        $this->om->endFlushSuite();
        $this->dispatcher->dispatch('log', 'Log\LogResourceMove', [$child, $parent]);

        return $child;
    }

    /**
     * Copies a resource in a directory.
     *
     * @deprecated use crud instead
     *
     * @param ResourceNode $node
     * @param ResourceNode $parent
     * @param User         $user
     *
     * @return ResourceNode
     *
     * @throws ResourceNotFoundException
     */
    public function copy(ResourceNode $node, ResourceNode $parent, User $user)
    {
        $this->log("Copying {$node->getName()} from type {$node->getResourceType()->getName()}");

        /** @var ResourceNode $newNode */
        $newNode = $this->crud->copy($node, [OPTIONS::IGNORE_RIGHTS], ['user' => $user, 'parent' => $parent]);

        $this->om->persist($newNode);
        $this->om->flush();

        return $newNode;
    }

    /**
     * Sets the publication flag of a collection of nodes.
     *
     * @param ResourceNode[] $nodes
     * @param bool           $arePublished
     * @param bool           $isRecursive
     *
     * @return ResourceNode[]
     */
    public function setPublishedStatus(array $nodes, $arePublished, $isRecursive = false)
    {
        foreach ($nodes as $node) {
            $this->crud->update(ResourceNode::class, [
                'id' => $node->getUuid(),
                'meta' => ['published' => $arePublished],
            ]);

            // do it on every children too
            if ($isRecursive) {
                $descendants = $this->resourceNodeRepo->findDescendants($node);
                $this->setPublishedStatus($descendants, $arePublished, false);
            }
        }

        return $nodes;
    }

    /**
     * Removes a resource.
     *
     * @param ResourceNode $node
     * @param bool         $softDelete
     *
     * @throws \LogicException
     */
    public function delete(ResourceNode $node, $softDelete = false)
    {
        $this->crud->delete($node, $softDelete ? [Options::SOFT_DELETE] : []);
    }

    /**
     * Returns an archive with the required content.
     *
     * @param ResourceNode[] $elements     - the nodes being exported
     * @param bool           $forceArchive
     *
     * @throws ExportResourceException
     *
     * @return array
     */
    public function download(array $elements, $forceArchive = false)
    {
        $data = [];

        if (0 === count($elements)) {
            throw new ExportResourceException('No resources were selected.');
        }

        $pathArch = $this->tempManager->generate();

        $archive = new \ZipArchive();
        $archive->open($pathArch, \ZipArchive::CREATE);

        $nodes = $this->expandResources($elements);
        if (!$forceArchive && 1 === count($nodes)) {
            /** @var DownloadResourceEvent $event */
            $event = $this->dispatcher->dispatch(
                "download_{$nodes[0]->getResourceType()->getName()}",
                DownloadResourceEvent::class,
                [$this->getResourceFromNode($this->getRealTarget($nodes[0]))]
            );
            $extension = $event->getExtension();
            $hasExtension = '' !== pathinfo($nodes[0]->getName(), PATHINFO_EXTENSION);

            $extGuesser = ExtensionGuesser::getInstance();
            $mimeGuesser = MimeTypeGuesser::getInstance();

            if (!$hasExtension) {
                $extension = $extGuesser->guess($nodes[0]->getMimeType());
            }

            $data['name'] = $hasExtension ?
                $nodes[0]->getName() :
                $nodes[0]->getName().'.'.$extension;
            $data['file'] = $event->getItem();
            $data['mimeType'] = $nodes[0]->getMimeType() ? $nodes[0]->getMimeType() : $mimeGuesser->guess($extension);

            return $data;
        }

        $currentDir = null;
        if (isset($elements[0])) {
            $currentDir = $elements[0];
        } else {
            $archive->addEmptyDir($elements[0]->getName());
        }

        foreach ($nodes as $node) {
            //we only download is we can...
            if ($this->authorization->isGranted('EXPORT', $node)) {
                $resource = $this->getResourceFromNode($node);

                if ($resource) {
                    $filename = $this->getRelativePath($currentDir, $node).$node->getName();
                    $resource = $this->getResourceFromNode($node);

                    //if it's a file, we may have to add the extension back in case someone removed it from the name
                    if ('file' === $node->getResourceType()->getName()) {
                        $extension = '.'.pathinfo($resource->getHashName(), PATHINFO_EXTENSION);
                        if (!preg_match("#$extension#", $filename)) {
                            $filename .= $extension;
                        }
                    }

                    if ('directory' !== $node->getResourceType()->getName()) {
                        /** @var DownloadResourceEvent $event */
                        $event = $this->dispatcher->dispatch(
                            "download_{$node->getResourceType()->getName()}",
                            DownloadResourceEvent::class,
                            [$resource]
                        );

                        $obj = $event->getItem();

                        if (null !== $obj) {
                            $archive->addFile($obj, iconv($this->ut->detectEncoding($filename), $this->getEncoding(), $filename));
                        } else {
                            $archive->addFromString(iconv($this->ut->detectEncoding($filename), $this->getEncoding(), $filename), '');
                        }
                    } else {
                        $archive->addEmptyDir(iconv($this->ut->detectEncoding($filename), $this->getEncoding(), $filename));
                    }

                    $this->dispatcher->dispatch('log', 'Log\LogResourceExport', [$node]);
                }
            }
        }

        $archive->close();

        $data['name'] = 'archive.zip';
        $data['file'] = $pathArch;
        $data['mimeType'] = 'application/zip';

        return $data;
    }

    /**
     * @param Workspace $workspace
     *
     * @return ResourceNode
     */
    public function getWorkspaceRoot(Workspace $workspace)
    {
        return $this->resourceNodeRepo->findWorkspaceRoot($workspace);
    }

    /**
     * @param string $name
     *
     * @return ResourceType
     */
    public function getResourceTypeByName($name)
    {
        /** @var ResourceType $type */
        $type = $this->resourceTypeRepo->findOneBy(['name' => $name]);

        return $type;
    }

    /**
     * @return ResourceType[]
     */
    public function getAllResourceTypes()
    {
        return $this->resourceTypeRepo->findAll();
    }

    /**
     * @param mixed $id
     *
     * @return ResourceNode
     */
    public function getById($id)
    {
        /** @var ResourceNode $resourceNode */
        $resourceNode = $this->resourceNodeRepo->findOneBy(['id' => $id]);

        return $resourceNode;
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
            $this->log('class '.$node->getClass().' does not exists', 'error');
        }

        return null;
    }

    /**
     * Check if a ResourceNode can be added in a Workspace (resource amount limit).
     *
     * @param Workspace $workspace
     *
     * @return bool
     */
    public function checkResourceLimitExceeded(Workspace $workspace)
    {
        return $workspace->getMaxUploadResources() < $this->countActiveResources($workspace);
    }

    /**
     * Count the number of resources in a workspace.
     *
     * @param Workspace $workspace
     *
     * @return int
     */
    public function countActiveResources(Workspace $workspace = null)
    {
        return $this->resourceNodeRepo->count([
            'workspace' => $workspace,
            'active' => true,
        ]);
    }

    public function getLastIndex(ResourceNode $parent)
    {
        try {
            $lastIndex = $this->resourceNodeRepo->findLastIndex($parent);
        } catch (NonUniqueResultException $e) {
            $lastIndex = 0;
        } catch (NoResultException $e) {
            $lastIndex = 0;
        }

        return $lastIndex;
    }

    public function getNotDeletableResourcesByWorkspace(Workspace $workspace)
    {
        return $this->resourceNodeRepo->findBy(['workspace' => $workspace, 'deletable' => false]);
    }

    /**
     * Find all content for a given user and the replace him by another.
     *
     * @param User $from
     * @param User $to
     *
     * @return int
     */
    public function replaceCreator(User $from, User $to)
    {
        /** @var ResourceNode[] $nodes */
        $nodes = $this->resourceNodeRepo->findBy([
            'creator' => $from,
        ]);

        if (count($nodes) > 0) {
            foreach ($nodes as $node) {
                $node->setCreator($to);
            }

            $this->om->flush();
        }

        return count($nodes);
    }

    public function addView(ResourceNode $node)
    {
        $node->addView();

        $this->om->persist($node);
        $this->om->flush();

        return $node;
    }

    /**
     * Restores a soft deleted resource node.
     *
     * @param ResourceNode $resourceNode
     */
    public function restore(ResourceNode $resourceNode)
    {
        $this->setActive($resourceNode);
        $workspace = $resourceNode->getWorkspace();
        if ($workspace) {
            $root = $this->getWorkspaceRoot($workspace);
            $resourceNode->setParent($root);
        }
        $name = substr($resourceNode->getName(), 0, strrpos($resourceNode->getName(), '_'));
        $resourceNode->setName($name);
        $resourceNode->setName($this->getUniqueName($resourceNode));
        $this->om->persist($resourceNode);
        $this->om->flush();
    }

    public function load(ResourceNode $resourceNode, $embedded = false)
    {
        $resource = $this->getResourceFromNode($resourceNode);
        if ($resource) {
            /** @var LoadResourceEvent $event */
            $event = $this->dispatcher->dispatch(
              'resource.load',
              LoadResourceEvent::class,
              [$resource, $embedded]
          );

            return $event->getData();
        }

        throw new ResourceNotFoundException();
    }

    public function isManager(ResourceNode $resourceNode)
    {
        return $this->rightsManager->isManager($resourceNode);
    }

    public function checkIntegrity()
    {
        $resources = $this->resourceNodeRepo->findAll();
        $batchSize = 500;
        $i = 0;

        /** @var ResourceNode $resource */
        foreach ($resources as $resource) {
            $absRes = $this->getResourceFromNode($resource);

            if (!$absRes) {
                $this->log('Resource '.$resource->getName().' not found. Removing...');
                $this->om->remove($resource);
            } else {
                $parent = $resource->getParent();
                if (null === $resource->getWorkspace() && $parent) {
                    $workspace = $parent->getWorkspace();
                    if ($workspace) {
                        $resource->setWorkspace($workspace);
                        $this->om->persist($workspace);
                        if (0 === $batchSize % $i) {
                            $this->om->flush();
                        }
                    }
                }
            }
            ++$i;
        }

        $this->om->flush();
    }

    private function getEncoding()
    {
        return 'UTF-8//TRANSLIT';
    }

    /**
     * @param ResourceNode $node
     * @param bool         $throwException
     *
     * @return ResourceNode|null
     *
     * @throws \Exception
     *
     * @deprecated
     */
    private function getRealTarget(ResourceNode $node, $throwException = true)
    {
        if ('Claroline\LinkBundle\Entity\Resource\Shortcut' === $node->getClass()) {
            /** @var \Claroline\LinkBundle\Entity\Resource\Shortcut $resource */
            $resource = $this->getResourceFromNode($node);
            if (null === $resource) {
                if ($throwException) {
                    throw new \Exception('The resource was removed.');
                }

                return null;
            }
            $node = $resource->getTarget();
            if (null === $node) {
                if ($throwException) {
                    throw new \Exception('The node target was removed.');
                }

                return null;
            }
        }

        return $node;
    }

    /**
     * Gets the relative path between 2 instances (not optimized yet).
     *
     * @param ResourceNode $root
     * @param ResourceNode $node
     * @param string       $path
     *
     * @return string
     */
    private function getRelativePath(ResourceNode $root, ResourceNode $node, $path = '')
    {
        if ($node->getParent() !== $root->getParent() && null !== $node->getParent()) {
            $path = $node->getParent()->getName().DIRECTORY_SEPARATOR.$path;
            $path = $this->getRelativePath($root, $node->getParent(), $path);
        }

        return $path;
    }

    private function updateWorkspace(ResourceNode $node, Workspace $workspace)
    {
        $this->om->startFlushSuite();
        $node->setWorkspace($workspace);
        $this->om->persist($node);

        if (!empty($node->getChildren())) {
            // recursively load all children
            $children = $this->resourceNodeRepo->getChildren($node);

            /** @var ResourceNode $child */
            foreach ($children as $child) {
                $child->setWorkspace($workspace);
                $this->om->persist($child);
            }
        }
        $this->om->endFlushSuite();
    }

    private function setActive(ResourceNode $node)
    {
        foreach ($node->getChildren() as $child) {
            $this->setActive($child);
        }

        $node->setActive(true);
        $this->om->persist($node);
    }

    /**
     * Set the $node at the last position of the $parent.
     *
     * @param ResourceNode $parent
     * @param ResourceNode $node
     */
    private function setLastIndex(ResourceNode $parent, ResourceNode $node)
    {
        $max = $this->resourceNodeRepo->findLastIndex($parent);
        $node->setIndex($max + 1);

        $this->om->persist($node);
        $this->om->flush();
    }

    /**
     * Checks if an array of resource type name exists.
     * Expects an array of types array(array('name' => 'type'),...).
     *
     * @param array $resourceTypes
     *
     * @return array
     *
     * @throws ResourceTypeNotFoundException
     */
    private function checkResourceTypes(array $resourceTypes)
    {
        $typeNames = array_map(function (array $type) {
            return $type['name'];
        }, $resourceTypes);

        $validTypes = $this->resourceTypeRepo->findByNames($typeNames, false);
        if (count($validTypes) !== count($resourceTypes)) {
            $unknownTypes = array_filter($typeNames, function (string $type) use ($validTypes) {
                foreach ($validTypes as $validType) {
                    if ($type === $validType->getName()) {
                        return false;
                    }
                }

                return true;
            });

            throw new ResourceTypeNotFoundException(
                sprintf('The resource type(s) %s were not found.', implode(', ', $unknownTypes))
            );
        }

        return $validTypes;
    }

    /**
     * Set the right of a resource.
     * If $rights = array(), the $parent node rights will be copied.
     *
     * array $rights should be defined that way:
     * array('ROLE_WS_XXX' => array('open' => true, 'edit' => false, ...
     * 'create' => array('directory', ...), 'role' => $entity))
     *
     * @param ResourceNode $node
     * @param ResourceNode $parent
     * @param array        $rights
     *
     * @return ResourceNode
     */
    private function setRights(ResourceNode $node, ResourceNode $parent = null, array $rights = [])
    {
        if (0 === count($rights) && null !== $parent) {
            $node = $this->rightsManager->copy($parent, $node);
        } else {
            $this->createRights($node, $rights);
        }

        return $node;
    }

    /**
     * Returns every children of every resource (includes the start node).
     *
     * @param ResourceNode[] $nodes
     *
     * @return ResourceNode[]
     */
    private function expandResources(array $nodes)
    {
        $dirs = [];
        $resources = [];
        $toAppend = [];

        foreach ($nodes as $node) {
            $resourceTypeName = $node->getResourceType()->getName();
            ('directory' === $resourceTypeName) ? $dirs[] = $node : $resources[] = $node;
        }

        foreach ($dirs as $dir) {
            $children = $this->resourceNodeRepo->findDescendants($dir);

            foreach ($children as $child) {
                if ($child->isActive() &&
                    'directory' !== $child->getResourceType()->getName()) {
                    $toAppend[] = $child;
                }
            }
        }

        $merge = array_merge($toAppend, $resources);

        return $merge;
    }
}
