<?php

namespace Icap\LessonBundle\Controller\Resource;

use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\LessonBundle\Entity\Lesson;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class LessonController extends Controller
{
    /*
     * @EXT\Route("/lesson", options={"expose"=true})
     */
    use PermissionCheckerTrait;

    /**
     * @EXT\Route(
     *     "{id}/open",
     *     requirements={"id" = "\d+"},
     *     name="icap_lesson_open"
     * )
     * @EXT\ParamConverter("lesson", class="IcapLessonBundle:Lesson")
     * @EXT\Template("IcapLessonBundle:lesson:open.html.twig")
     *
     * @param Lesson $lesson
     *
     * @return array
     */
    public function openAction(Lesson $lesson)
    {
        $resourceNode = $lesson->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);

        return [
            '_resource' => $lesson,
        ];
    }

    /**
     * @EXT\Route(
     *      "view/{resourceId}.pdf",
     *      name="icap_lesson_pdf",
     *      requirements={"resourceId" = "\d+"}
     * )
     * @EXT\ParamConverter("lesson", class="IcapLessonBundle:Lesson", options={"id" = "resourceId"})
     */
    public function viewLessonPdfAction(Lesson $lesson)
    {
        $chapterRepository = $this->getDoctrine()->getManager()->getRepository('IcapLessonBundle:Chapter');
        $tree = $chapterRepository->buildChapterTree($lesson->getRoot());
        $content = $this->renderView(
                'IcapLessonBundle:lesson:open.pdf.twig', [
            '_resource' => $lesson,
            'tree' => $tree,
                ]
        );

        return new Response(
                $this->get('knp_snappy.pdf')->getOutputFromHtml(
                        $content, [
                    'outline' => true,
                    'footer-right' => '[page]/[toPage]',
                    'footer-spacing' => 3,
                    'footer-font-size' => 8,
                        ], true
                ), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$lesson->getResourceNode()->getName().'.pdf"',
                ]
        );
    }
}
