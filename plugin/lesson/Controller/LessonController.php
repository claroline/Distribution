<?php

namespace Icap\LessonBundle\Controller;

use Claroline\CoreBundle\Event\Log\LogResourceReadEvent;
use Claroline\CoreBundle\Library\Resource\ResourceCollection;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class LessonController extends Controller
{
    /**
     * @param string $permission
     * @param Lesson $lesson
     *
     * @throws AccessDeniedException
     */
    protected function checkAccess($permission, Lesson $lesson)
    {
        $collection = new ResourceCollection([$lesson->getResourceNode()]);
        if (!$this->get('security.authorization_checker')->isGranted($permission, $collection)) {
            throw new AccessDeniedException($collection->getErrorsForDisplay());
        }

        $logEvent = new LogResourceReadEvent($lesson->getResourceNode());
        $this->get('event_dispatcher')->dispatch('log', $logEvent);
    }

    /**
     * @Route(
     *      "view/{resourceId}",
     *      name="icap_lesson",
     *      requirements={"resourceId" = "\d+"}
     * )
     * @ParamConverter("lesson", class="IcapLessonBundle:Lesson", options={"id" = "resourceId"})
     * @Template("IcapLessonBundle::lesson.html.twig")
     *
     * @param Lesson $lesson
     *
     * @return array
     */
    public function viewLessonAction(Lesson $lesson)
    {
        $this->checkAccess('OPEN', $lesson);

        return [
            '_resource' => $lesson,
            'chapter' => $this->getDoctrine()->getManager()->getRepository('IcapLessonBundle:Chapter')->getFirstChapter($lesson),
        ];
    }

    /**
     * @Route(
     *      "view/{resourceId}.pdf",
     *      name="icap_lesson_pdf",
     *      requirements={"resourceId" = "\d+"}
     * )
     * @ParamConverter("lesson", class="IcapLessonBundle:Lesson", options={"id" = "resourceId"})
     */
    public function viewLessonPdfAction(Lesson $lesson)
    {
        $this->checkAccess('EXPORT', $lesson);
        $chapterRepository = $this->getDoctrine()->getManager()->getRepository('IcapLessonBundle:Chapter');
        $tree = $chapterRepository->buildChapterTree($lesson->getRoot());
        $content = $this->renderView(
                'IcapLessonBundle::lesson.pdf.twig', [
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
