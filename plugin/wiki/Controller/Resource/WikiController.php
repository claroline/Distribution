<?php

namespace Icap\WikiBundle\Controller\Resource;

use Icap\WikiBundle\Entity\Wiki;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @EXT\Route("/wiki", options={"expose"=true})
 */
class WikiController extends Controller
{
    /**
     * @EXT\Route(
     *      "/{id}/open",
     *      requirements={"id" = "\d+"},
     *      name="icap_wiki_open"
     * )
     * @EXT\ParamConverter("wiki", class="IcapWikiBundle:Wiki")
     * @EXT\Template("IcapWikiBundle:wiki:open.html.twig")
     *
     * @param Wiki $wiki
     *
     * @return array
     */
    public function openAction(Wiki $wiki)
    {
        return [];
    }
}
