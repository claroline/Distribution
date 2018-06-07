<?php

namespace Icap\WikiBundle\Controller\API;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\WikiBundle\Entity\Section;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @EXT\Route("/wiki/section/{sectionId}/contribution")
 * @EXT\ParamConverter(
 *     "section",
 *     class="IcapWikiBundle:Section",
 *     options={"mapping": {"sectionId": "uuid"}}
 * )
 */
class ContributionController
{
    use PermissionCheckerTrait;

    /** @var FinderProvider */
    private $finder;

    /**
     * @DI\InjectParams({
     *     "finder"                 = @DI\Inject("claroline.api.finder")
     * })
     *
     * SectionController constructor.
     *
     * @param FinderProvider $finder
     */
    public function __construct(
        FinderProvider $finder
    ) {
        $this->finder = $finder;
    }

    /**
     * @EXT\Route("/history", name="apiv2_wiki_section_contribution_history")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Method({"GET"})
     *
     * @param Section $section
     *
     * @return JsonResponse
     */
    public function listAction(Section $section, User $user, Request $request)
    {
        $wiki = $section->getWiki();
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);
        if (false === $section->getVisible() && $section->getAuthor()->getId() !== $user->getId()) {
            throw new AccessDeniedException('You cannot view the history of this section');
        }
        $query = $request->query->all();
        $query['hiddenFilters'] = ['section' => $section];

        return new JsonResponse(
            $this->finder->search(
                $this->getClass(),
                $query,
                []
            )
        );
    }

    private function getClass()
    {
        return 'Icap\WikiBundle\Entity\Contribution';
    }
}
