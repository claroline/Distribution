<?php

namespace Icap\WikiBundle\Controller\Resource;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\WikiBundle\Entity\Wiki;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @EXT\Route("/wiki", options={"expose"=true})
 */
class WikiController extends Controller
{
    use PermissionCheckerTrait;

    /**
     * @EXT\Route(
     *      "/{id}/open",
     *      requirements={"id" = "\d+"},
     *      name="icap_wiki_open"
     * )
     * @EXT\ParamConverter("wiki", class="IcapWikiBundle:Wiki")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Template("IcapWikiBundle:wiki:open.html.twig")
     *
     * @param Wiki      $wiki
     * @param User|null $user
     *
     * @return array
     */
    public function openAction(Wiki $wiki, User $user = null)
    {
        $resourceNode = $wiki->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);

        return [
            '_resource' => $wiki,
        ];
    }
}
