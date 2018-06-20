<?php

namespace Icap\WikiBundle\Controller\API;

use Claroline\CoreBundle\Entity\Resource\AbstractResourceEvaluation;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Event\Log\LogResourceReadEvent;
use Claroline\CoreBundle\Library\Resource\ResourceCollection;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\NamePrefix;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\QueryParam;
use FOS\RestBundle\Controller\Annotations\RequestParam;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Request\ParamFetcher;
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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @NamePrefix("icap_wiki_api_")
 */
class ApiController extends FOSRestController
{
    /**
     * Update wiki options.
     *
     * @param Wiki         $wiki
     * @param ParamFetcher $paramFetcher
     *
     * @Route(
     *     requirements={ "wiki" = "\d+" }
     * )
     * @RequestParam(
     *     name="mode",
     *     description="In which mode should the wiki operate? 0 = normal, 1 = moderated, 2 = blocked",
     *     requirements="[0,1,2]"
     * )
     * @RequestParam(
     *     name="displaySectionNumbers",
     *     description="Should the section number be displayed in the wiki body?",
     * )
     */
    public function patchWikiAction(Wiki $wiki, ParamFetcher $paramFetcher)
    {
        $this->checkAccess('EDIT', $wiki);

        $wiki->setMode($paramFetcher->get('mode'));
        $wiki->setDisplaySectionNumbers($paramFetcher->get('displaySectionNumbers'));

        $em = $this->getDoctrine()->getManager();
        $em->persist($wiki);
        $em->flush();

        $unitOfWork = $em->getUnitOfWork();
        $unitOfWork->computeChangeSets();
        $changeSet = $unitOfWork->getEntityChangeSet($wiki);
        $this->dispatchWikiConfigureEvent($wiki, $changeSet);
    }

    /**
     * Update section configuration (visibility or position in tree) but not the current contribution.
     *
     * @param Wiki         $wiki
     * @param Section      $section
     * @param ParamFetcher $paramFetcher
     *
     * @return mixed[]
     *
     * @Route(
     *     requirements = { "wiki" = "\d+", "section" = "\d+" }
     * )
     * @QueryParam(
     *     name="visible",
     *     requirements="(true|false)",
     *     description="Sets the visibility of the section"
     * )
     * @QueryParam(
     *     name="referenceSectionId",
     *     requirements="\d+",
     *     nullable=true,
     *     description="Id of the section serving as new parent or sibling"
     * )
     * @QueryParam(
     *     name="isBrother",
     *     requirements="(true|false)",
     *     nullable=true,
     *     description="Should the section be treated as sibling of the reference section ?"
     * )
     */
    public function putWikiSectionAction(Wiki $wiki, Section $section, ParamFetcher $paramFetcher)
    {
        $this->checkAccess('EDIT', $wiki);

        // Adjust visibility
        $oldVisibility = $section->getVisible();
        $newVisibility = 'true' === $paramFetcher->get('visible');

        if ($oldVisibility !== $newVisibility) {
            $collection = $collection = new ResourceCollection([$wiki->getResourceNode()]);
            $isAdmin = $this->isUserGranted('EDIT', $wiki, $collection);
            $visible = ($newVisibility && 0 === $wiki->getMode()) || ($newVisibility && $isAdmin);
            $section->setVisible($visible);
        }

        // Move section in the tree
        $referenceSectionId = $paramFetcher->get('referenceSectionId');
        $sectionRepository = $this->get('icap.wiki.section_repository');

        if (null !== $referenceSectionId) {
            $oldParent = $section->getParent();
            $oldLeft = $section->getLeft();

            $isBrother = 'true' === $paramFetcher->get('isBrother');
            $referenceSection = $this->getSection($wiki, $referenceSectionId);

            if ($isBrother && !$referenceSection->isRoot() && $referenceSection !== $oldLeft) {
                $sectionRepository->persistAsNextSiblingOf($section, $referenceSection);
                $newParent = $referenceSection->getParent();
                $changeSet = $section->getMoveEventChangeSet($oldParent, $oldLeft, $newParent);
                $this->dispatchSectionMoveEvent($wiki, $section, $changeSet);
            } elseif ($referenceSection !== $oldParent) {
                $sectionRepository->persistAsFirstChildOf($section, $referenceSection);
                $newParent = $referenceSection;
                $changeSet = $section->getMoveEventChangeSet($oldParent, $oldLeft, $newParent);
                $this->dispatchSectionMoveEvent($wiki, $section, $changeSet);
            }
        }

        // Save section in database
        $em = $this->getDoctrine()->getManager();
        $em->persist($section);
        $em->flush();

        $isAdmin = $this->isUserGranted('EDIT', $wiki);

        return [
            'section' => [
                'id' => $section->getId(),
                'visible' => $section->getVisible(),
                'parent' => $section->getParent()->getId(),
                'left' => $section->getLeft(),
            ],
            'sections' => $sectionRepository->buildSectionTree($wiki, $isAdmin, $this->getLoggedUser()),
        ];
    }

    /**
     * Move a section around the tree.
     *
     * @param Wiki    $wiki
     * @param Section $section
     *
     * @return mixed[]
     *
     * @Post(
     *     "/api/wikis/{wiki}/sections/{section}",
     *     name="icap_wiki_api_move_wiki_section",
     *     requirements={ "wiki" = "\d+", "section" = "\d+" },
     *     options = { "expose" = true }
     * )
     */
    public function moveWikiSectionAction(Wiki $wiki, Section $section)
    {
        $this->checkAccess('EDIT', $wiki);

        $repo = $this->get('icap.wiki.section_repository');

        $response = new JsonResponse();

        $payload = $this->get('request_stack')->getMasterRequest()->request->all();

        try {
            $newParentId = $payload['newParent'];
            $newPreviousSiblingId = $payload['newPreviousSibling'];

            // If new parent is root, get its ID
            if (is_null($newParentId)) {
                $newParentId = $wiki->getRoot()->getId();
            }

            $oldParent = $section->getparent();
            $oldLeft = $section->getLeft();
            $newParent = $this->getSection($wiki, $newParentId);

            if (!is_null($newPreviousSiblingId)) {
                $newPreviousSibling = $this->getSection($wiki, $newPreviousSiblingId);
                $repo->persistAsNextSiblingOf($section, $newPreviousSibling);
            } else {
                $repo->persistAsFirstChildOf($section, $newParent);
            }

            $em = $this->getDoctrine()->getManager();
            $em->persist($section);
            $em->flush();

            $changeSet = $section->getMoveEventChangeSet($oldParent, $oldLeft, $newParent);
            $this->dispatchSectionMoveEvent($wiki, $section, $changeSet);

            return $response->setData([
                'response' => 'moved',
            ]);
        } catch (Exception $e) {
            // Something went wrong, send the last known version of the sections to the client
            $isAdmin = $this->isUserGranted('EDIT', $wiki);

            return $response->setStatusCode(400)->setData([
                'sections' => $repo->buildSectionTree($wiki, $isAdmin),
            ]);
        }
    }

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
    protected function isUserGranted($permission, Wiki $wiki, $collection = null)
    {
        if (null === $collection) {
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
     * @param Wiki   $wiki
     * @param string $childType
     * @param string $action
     * @param array  $details
     *
     * @return Controller
     */
    protected function dispatchChildEvent(Wiki $wiki, $childType, $action, $details = [])
    {
        $event = new LogResourceChildUpdateEvent(
            $wiki->getResourceNode(),
            $childType,
            $action,
            $details
        );

        return $this->dispatch($event);
    }

    /**
     * @param Wiki  $wiki
     * @param array $changeSet
     *
     * @return Controller
     */
    protected function dispatchWikiUpdateEvent(Wiki $wiki, $changeSet)
    {
        $event = new LogResourceUpdateEvent($wiki->getResourceNode(), $changeSet);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki    $wiki
     * @param Section $section
     *
     * @return Controller
     */
    protected function dispatchSectionCreateEvent(Wiki $wiki, Section $section)
    {
        $event = new LogSectionCreateEvent($wiki, $section);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki    $wiki
     * @param Section $section
     * @param array   $changeSet
     *
     * @return Controller
     */
    protected function dispatchSectionMoveEvent(Wiki $wiki, Section $section, $changeSet)
    {
        $event = new LogSectionMoveEvent($wiki, $section, $changeSet);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki    $wiki
     * @param Section $section
     * @param array   $changeSet
     *
     * @return Controller
     */
    protected function dispatchSectionUpdateEvent(Wiki $wiki, Section $section, $changeSet)
    {
        $event = new LogSectionUpdateEvent($wiki, $section, $changeSet);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki    $wiki
     * @param Section $section
     *
     * @return Controller
     */
    protected function dispatchSectionDeleteEvent(Wiki $wiki, Section $section)
    {
        $event = new LogSectionDeleteEvent($wiki, $section);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki    $wiki
     * @param Section $section
     *
     * @return Controller
     */
    protected function dispatchSectionRemoveEvent(Wiki $wiki, Section $section)
    {
        $event = new LogSectionRemoveEvent($wiki, $section);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki    $wiki
     * @param Section $section
     *
     * @return Controller
     */
    protected function dispatchSectionRestoreEvent(Wiki $wiki, Section $section)
    {
        $event = new LogSectionRestoreEvent($wiki, $section);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki         $wiki
     * @param Section      $section
     * @param Contribution $contribution
     *
     * @return Controller
     */
    protected function dispatchContributionCreateEvent(Wiki $wiki, Section $section, Contribution $contribution)
    {
        $event = new LogContributionCreateEvent($wiki, $section, $contribution);

        return $this->dispatch($event);
    }

    /**
     * @param Wiki  $wiki
     * @param array $changeSet
     *
     * @return Controller
     */
    protected function dispatchWikiConfigureEvent(Wiki $wiki, $changeSet)
    {
        $event = new LogWikiConfigureEvent($wiki, $changeSet);

        return $this->dispatch($event);
    }

    /**
     * Retrieve a section from database.
     *
     * @param Wiki $wiki
     * @param int  $sectionId
     *
     * @throws NotFoundHttpException
     *
     * @return Section $section
     */
    protected function getSection($wiki, $sectionId)
    {
        $section = $this
            ->get('icap.wiki.section_repository')
            ->findOneBy(['id' => $sectionId, 'wiki' => $wiki]);
        if (null === $section) {
            throw new NotFoundHttpException();
        }

        return $section;
    }

    /**
     * Retrieve a contribution from database.
     *
     * @param Section $section
     * @param int     $contributionId
     *
     * @throws NotFoundHttpException
     *
     * @return Contribution
     */
    protected function getContribution($section, $contributionId)
    {
        $contribution = $this
            ->get('icap.wiki.contribution_repository')
            ->findOneBy(['id' => $contributionId, 'section' => $section]);
        if (null === $section) {
            throw new NotFoundHttpException();
        }

        return $contribution;
    }

    /**
     * Retrieve logged user. If anonymous return null.
     *
     * @return User
     */
    protected function getLoggedUser()
    {
        $user = $this->get('security.token_storage')->getToken()->getUser();
        if (is_string($user)) {
            $user = null;
        }

        return $user;
    }

    /**
     * Logs participation in resource tracking.
     *
     * @param ResourceNode $node
     * @param User         $user
     * @param \DateTime    $date
     */
    protected function updateResourceTracking(ResourceNode $node, User $user, \DateTime $date)
    {
        $this->get('claroline.manager.resource_evaluation_manager')->updateResourceUserEvaluationData(
            $node,
            $user,
            $date,
            AbstractResourceEvaluation::STATUS_PARTICIPATED
        );
    }
}
