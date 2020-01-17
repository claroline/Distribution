<?php

namespace Icap\WikiBundle\Controller\API;

use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\WikiBundle\Entity\Wiki;
use Icap\WikiBundle\Manager\WikiManager;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

/**
 * @EXT\Route("/wiki/{id}")
 * @EXT\ParamConverter(
 *     "wiki",
 *     class="IcapWikiBundle:Wiki",
 *     options={"mapping": {"id": "uuid"}}
 * )
 */
class WikiController
{
    use PermissionCheckerTrait;

    /** @var WikiManager */
    private $wikiManager;

    /**
     * WikiController constructor.
     */
    public function __construct(WikiManager $wikiManager, AuthorizationCheckerInterface $authorization)
    {
        $this->wikiManager = $wikiManager;
        $this->authorization = $authorization;
    }

    /**
     * @EXT\Route("/", name="apiv2_wiki_update_options")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Method({"PUT"})
     *
     * @param Wiki $wiki
     *
     * @return JsonResponse
     */
    public function updateOptionsAction(Wiki $wiki, Request $request)
    {
        $this->checkPermission('EDIT', $wiki->getResourceNode(), [], true);
        try {
            $this->wikiManager->updateWiki($wiki, json_decode($request->getContent(), true));

            return new JsonResponse($this->wikiManager->serializeWiki($wiki));
        } catch (\Exception $e) {
            return new JsonResponse($e->getMessage(), 422);
        }
    }
}
