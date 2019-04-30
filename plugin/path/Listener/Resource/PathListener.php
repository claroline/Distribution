<?php

namespace Innova\PathBundle\Listener\Resource;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Resource\Directory;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\LoadResourceEvent;
use Claroline\CoreBundle\Manager\ResourceManager;
use Innova\PathBundle\Entity\Path\Path;
use Innova\PathBundle\Entity\SecondaryResource;
use Innova\PathBundle\Entity\Step;
use Innova\PathBundle\Manager\UserProgressionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * Used to integrate Path to Claroline resource manager.
 *
 * @DI\Service()
 */
class PathListener
{
    /** @var TokenStorageInterface */
    private $tokenStorage;

    /** @var TwigEngine */
    private $templating;

    /** @var TranslatorInterface */
    private $translator;

    /* @var ObjectManager */
    private $om;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ResourceManager */
    private $resourceManager;

    /** @var UserProgressionManager */
    private $userProgressionManager;

    /**
     * PathListener constructor.
     *
     * @DI\InjectParams({
     *     "tokenStorage"           = @DI\Inject("security.token_storage"),
     *     "templating"             = @DI\Inject("templating"),
     *     "translator"             = @DI\Inject("translator"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer"             = @DI\Inject("claroline.api.serializer"),
     *     "resourceManager"        = @DI\Inject("claroline.manager.resource_manager"),
     *     "userProgressionManager" = @DI\Inject("innova_path.manager.user_progression")
     * })
     *
     * @param TokenStorageInterface  $tokenStorage
     * @param TwigEngine             $templating
     * @param TranslatorInterface    $translator
     * @param ObjectManager          $om
     * @param SerializerProvider     $serializer
     * @param ResourceManager        $resourceManager
     * @param UserProgressionManager $userProgressionManager
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        TwigEngine $templating,
        TranslatorInterface $translator,
        ObjectManager $om,
        SerializerProvider $serializer,
        ResourceManager $resourceManager,
        UserProgressionManager $userProgressionManager)
    {
        $this->tokenStorage = $tokenStorage;
        $this->templating = $templating;
        $this->translator = $translator;
        $this->om = $om;
        $this->serializer = $serializer;
        $this->resourceManager = $resourceManager;
        $this->userProgressionManager = $userProgressionManager;
    }

    /**
     * Loads the Path resource.
     *
     * @DI\Observe("resource.innova_path.load")
     *
     * @param LoadResourceEvent $event
     */
    public function onLoad(LoadResourceEvent $event)
    {
        /** @var Path $path */
        $path = $event->getResource();

        $event->setData([
            'path' => $this->serializer->serialize($path),
            'userEvaluation' => $this->serializer->serialize(
                $this->userProgressionManager->getUpdatedResourceUserEvaluation($path)
            ),
        ]);
        $event->stopPropagation();
    }

    /**
     * Fired when a ResourceNode of type Path is deleted.
     *
     * @DI\Observe("delete_innova_path")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $event->stopPropagation();
    }

    /**
     * Fired when a ResourceNode of type Path is duplicated.
     *
     * @DI\Observe("resource.innova_path.copy")
     *
     * @param CopyResourceEvent $event
     *
     * @throws \Exception
     */
    public function onCopy(CopyResourceEvent $event)
    {
        // Start the transaction. We'll copy every resource in one go that way.
        $this->om->startFlushSuite();

        /** @var Path $path */
        $path = $event->getCopy();
        $pathNode = $path->getResourceNode();

        if ($path->hasResources()) {
            // create a directory to store copied resources
            $resourcesDirectory = $this->createResourcesCopyDirectory($pathNode->getParent(), $pathNode->getName());
            // A forced flush is required for rights propagation on the copied resources
            $this->om->forceFlush();

            // copy resources for all steps
            $copiedResources = [];
            foreach ($path->getSteps() as $step) {
                if ($step->hasResources()) {
                    $copiedResources = $this->copyStepResources($step, $resourcesDirectory->getResourceNode(), $copiedResources);
                }
            }
        }

        $this->om->persist($path);

        // End the transaction
        $this->om->endFlushSuite();
        $event->setCopy($path);

        $event->stopPropagation();
    }

    /**
     * Create directory to store copies of resources.
     *
     * @param ResourceNode $destination
     * @param string       $pathName
     *
     * @return AbstractResource
     */
    private function createResourcesCopyDirectory(ResourceNode $destination, $pathName)
    {
        // Get current User
        $user = $this->tokenStorage->getToken()->getUser();

        $resourcesDir = $this->resourceManager->createResource(
            Directory::class,
            $pathName.' ('.$this->translator->trans('resources', [], 'platform').')'
        );

        return $this->resourceManager->create(
            $resourcesDir,
            $destination->getResourceType(),
            $user,
            $destination->getWorkspace(),
            $destination
        );
    }

    private function copyStepResources(Step $step, ResourceNode $destination, array $copiedResources = [])
    {
        // get current User
        $user = $this->tokenStorage->getToken()->getUser();

        // copy primary resource
        if (!empty($step->getResource())) {
            $resourceNode = $step->getResource();
            if (!isset($copiedResources[$resourceNode->getUuid()])) {
                // resource not already copied, create a new copy
                $resourceCopy = $this->resourceManager->copy($resourceNode, $destination, $user);
                if ($resourceCopy) {
                    $copiedResources[$resourceNode->getUuid()] = $resourceCopy->getResourceNode();
                }
            }

            // replace resource by the copy
            $step->setResource($copiedResources[$resourceNode->getUuid()]);
        }

        // copy secondary resources
        if (!empty($step->getSecondaryResources())) {
            foreach ($step->getSecondaryResources() as $secondaryResource) {
                $resourceNode = $secondaryResource->getResource();
                if (!isset($copiedResources[$resourceNode->getUuid()])) {
                    // resource not already copied, create a new copy
                    $resourceCopy = $this->resourceManager->copy($resourceNode, $destination, $user);
                    if ($resourceCopy) {
                        $copiedResources[$resourceNode->getUuid()] = $resourceCopy->getResourceNode();
                    }
                }

                // replace resource by the copy
                $secondaryResource->setResource($copiedResources[$resourceNode->getUuid()]);
            }
        }

        return $copiedResources;
    }
}
