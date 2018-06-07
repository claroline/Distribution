<?php

namespace Icap\WikiBundle\Controller\API;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\WikiBundle\Entity\Wiki;
use Icap\WikiBundle\Manager\SectionManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("/wiki/{wikiId}/section")
 * @EXT\ParamConverter(
 *     "wiki",
 *     class="IcapWikiBundle:Wiki",
 *     options={"mapping": {"wikiId": "uuid"}}
 * )
 */
class SectionController
{
    use PermissionCheckerTrait;

    /** @var FinderProvider */
    private $finder;

    /** @var SectionManager */
    private $sectionManager;

    /**
     * @DI\InjectParams({
     *     "finder"                 = @DI\Inject("claroline.api.finder"),
     *     "sectionManager"         = @DI\Inject("icap.wiki.section_manager")
     * })
     *
     * SectionController constructor.
     *
     * @param FinderProvider $finder
     * @param SectionManager $sectionManager
     */
    public function __construct(
        FinderProvider $finder,
        SectionManager $sectionManager
    ) {
        $this->finder = $finder;
        $this->sectionManager = $sectionManager;
    }

    /**
     * @EXT\Route("/tree", name="apiv2_wiki_section_tree")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Method({"GET"})
     *
     * @param Wiki $wiki
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
     * @EXT\Route("/deleted", name="apiv2_wiki_section_list")
     * @EXT\Method({"GET"})
     *
     * @param Wiki $wiki
     *
     * @return JsonResponse
     */
    public function deletedListAction(Wiki $wiki, Request $request)
    {
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('ADMINISTRATE', $resourceNode, [], true);

        $query = $request->query->all();
        $query['hiddenFilters'] = ['wiki' => $wiki, 'deleted' => true];

        return new JsonResponse($this->finder->search(
            $this->getClass(),
            $query,
            []
        ));
    }

    public function getClass()
    {
        return 'Icap\WikiBundle\Entity\Section';
    }
}
