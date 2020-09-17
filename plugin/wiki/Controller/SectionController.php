<?php

namespace Icap\WikiBundle\Controller;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Controller\RequestDecoderTrait;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Entity\Wiki;
use Icap\WikiBundle\Manager\SectionManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Route("/wiki")
 */
class SectionController
{
    use PermissionCheckerTrait;
    use RequestDecoderTrait;

    /** @var FinderProvider */
    private $finder;

    /** @var SectionManager */
    private $sectionManager;

    /**
     * SectionController constructor.
     *
     * @param FinderProvider                $finder
     * @param SectionManager                $sectionManager
     * @param AuthorizationCheckerInterface $authorization
     */
    public function __construct(
        FinderProvider $finder,
        SectionManager $sectionManager,
        AuthorizationCheckerInterface $authorization
    ) {
        $this->finder = $finder;
        $this->sectionManager = $sectionManager;
        $this->authorization = $authorization;
    }

    public function getClass()
    {
        return Section::class;
    }

    /**
     * @Route("/{wikiId}/tree", name="apiv2_wiki_section_tree")
     * @EXT\ParamConverter(
     *     "wiki",
     *     class="IcapWikiBundle:Wiki",
     *     options={"mapping": {"wikiId": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Method({"GET"})
     *
     * @param Wiki $wiki
     * @param User $user
     *
     * @return JsonResponse
     */
    public function treeAction(Wiki $wiki, User $user = null)
    {
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);
        $isAdmin = $this->checkPermission('EDIT', $resourceNode);
        $tree = $this->sectionManager->getSerializedSectionTree($wiki, $user, $isAdmin);

        return new JsonResponse(
            $tree
        );
    }

    /**
     * @Route("/section/{id}/visible", name="apiv2_wiki_section_set_visibility")
     * @EXT\ParamConverter(
     *     "section",
     *     class="IcapWikiBundle:Section",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\Method({"PUT"})
     *
     * @param Section $section
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function setVisibilityAction(Section $section, Request $request)
    {
        $resourceNode = $section->getWiki()->getResourceNode();
        $this->checkPermission('EDIT', $resourceNode, [], true);
        $visible = $request->request->get('visible');
        if (isset($visible)) {
            $this->sectionManager->updateSectionVisibility($section, $visible);
        }

        return new JsonResponse(
            $this->sectionManager->serializeSection($section)
        );
    }

    /**
     * @Route("/section/{id}", name="apiv2_wiki_section_create")
     * @EXT\ParamConverter(
     *     "section",
     *     class="IcapWikiBundle:Section",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     * @EXT\Method({"POST"})
     *
     * @param Section $section
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function createAction(Section $section, User $user, Request $request)
    {
        $wiki = $section->getWiki();
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);
        $isAdmin = $this->checkPermission('EDIT', $resourceNode);
        if (Wiki::READ_ONLY_MODE === $wiki->getMode() && !$isAdmin) {
            throw new AccessDeniedException('Cannot edit section in READ ONLY wiki');
        }
        $newSection = $this->sectionManager->createSection($wiki, $section, $user, $isAdmin, json_decode($request->getContent(), true));

        return new JsonResponse(
            $this->sectionManager->serializeSection($newSection, [Options::DEEP_SERIALIZE], true)
        );
    }

    /**
     * @Route("/section/{id}", name="apiv2_wiki_section_update")
     * @EXT\ParamConverter(
     *     "section",
     *     class="IcapWikiBundle:Section",
     *     options={"mapping": {"id": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     * @EXT\Method({"PUT"})
     *
     * @param Section $section
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function updateAction(Section $section, User $user, Request $request)
    {
        $wiki = $section->getWiki();
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);
        $isAdmin = $this->checkPermission('EDIT', $resourceNode);
        if (Wiki::READ_ONLY_MODE === $wiki->getMode() && !$isAdmin) {
            throw new AccessDeniedException('Cannot edit section in READ ONLY wiki');
        }
        $this->sectionManager->updateSection($section, $user, json_decode($request->getContent(), true));

        return new JsonResponse(
            $this->sectionManager->serializeSection($section, [Options::DEEP_SERIALIZE])
        );
    }

    /**
     * @Route("/{wikiId}/section/delete", name="apiv2_wiki_section_delete")
     * @EXT\ParamConverter(
     *     "wiki",
     *     class="IcapWikiBundle:Wiki",
     *     options={"mapping": {"wikiId": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     * @EXT\Method({"DELETE"})
     *
     * @param Wiki    $wiki
     * @param User    $user
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function deleteAction(Wiki $wiki, User $user, Request $request)
    {
        $content = $this->decodeRequest($request);

        $this->sectionManager->deleteSections(
            $wiki,
            $content['ids'],
            $content['children'],
            $content['permanently'],
            $this->checkPermission('EDIT', $wiki->getResourceNode()),
            $user
        );

        return new JsonResponse(true);
    }

    /**
     * @Route("/{wikiId}/section/restore", name="apiv2_wiki_section_restore")
     * @EXT\ParamConverter(
     *     "wiki",
     *     class="IcapWikiBundle:Wiki",
     *     options={"mapping": {"wikiId": "uuid"}}
     * )
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     * @EXT\Method({"POST"})
     *
     * @param Wiki    $wiki
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function restoreAction(Wiki $wiki, Request $request)
    {
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('EDIT', $resourceNode, [], true);
        $this->sectionManager->restoreSections($wiki, $request->get('ids'));

        return new JsonResponse(true);
    }

    /**
     * @Route("/{wikiId}/sections/deleted", name="apiv2_wiki_section_deleted_list")
     * @EXT\Method({"GET"})
     * @EXT\ParamConverter(
     *     "wiki",
     *     class="IcapWikiBundle:Wiki",
     *     options={"mapping": {"wikiId": "uuid"}}
     * )
     *
     * @param Wiki    $wiki
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function deletedListAction(Wiki $wiki, Request $request)
    {
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('EDIT', $resourceNode, [], true);

        $query = $request->query->all();
        $query['hiddenFilters'] = ['wiki' => $wiki, 'deleted' => true];

        return new JsonResponse($this->finder->search(
            $this->getClass(),
            $query,
            []
        ));
    }
}
