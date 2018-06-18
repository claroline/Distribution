<?php

namespace Icap\WikiBundle\Controller;

use Claroline\CoreBundle\Entity\User;
use Icap\WikiBundle\Entity\Wiki;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class WikiController extends Controller
{
    public function viewAction(Wiki $wiki, Request $request)
    {
        $format = $request->get('_format');
        if ('pdf' === $format) {
            $this->checkAccess('EXPORT', $wiki);
        } else {
            $this->checkAccess('OPEN', $wiki);
        }
        $isAdmin = $this->isUserGranted('EDIT', $wiki);
        $user = $this->getLoggedUser();
        $sectionRepository = $this->get('icap.wiki.section_repository');
        $tree = $sectionRepository->buildSectionTree($wiki, $isAdmin, $user);
        $response = new Response();
        $this->render(sprintf('IcapWikiBundle:Wiki:view.%s.twig', $format), [
            '_resource' => $wiki,
            'tree' => $tree,
            'workspace' => $wiki->getResourceNode()->getWorkspace(),
            'isAdmin' => $isAdmin,
            'user' => $user,
        ], $response);
        if ('pdf' === $format) {
            return new Response(
                $this->get('knp_snappy.pdf')->getOutputFromHtml(
                    $response->getContent(),
                    [
                        'outline' => true,
                        'footer-right' => '[page]/[toPage]',
                        'footer-spacing' => 3,
                        'footer-font-size' => 8,
                    ],
                    true
                ),
                200,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="'.$wiki->getResourceNode()->getName().'.pdf"',
                ]
            );
        }

        return $response;
    }
}
