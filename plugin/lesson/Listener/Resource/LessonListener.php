<?php

namespace Icap\LessonBundle\Listener\Resource;

use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Event\ExportObjectEvent;
use Claroline\CoreBundle\Event\ImportObjectEvent;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\Resource\LoadResourceEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;
use Icap\LessonBundle\Manager\ChapterManager;
use Icap\LessonBundle\Repository\ChapterRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\Response;

/**
 * @DI\Service()
 */
class LessonListener
{
    /** @var EngineInterface */
    private $templating;

    /* @var ObjectManager */
    private $om;

    /** @var PlatformConfigurationHandler */
    private $config;

    /** @var SerializerProvider */
    private $serializer;

    /** @var ChapterManager */
    private $chapterManager;

    /** @var ChapterRepository */
    private $chapterRepository;

    /**
     * LessonListener constructor.
     *
     * @DI\InjectParams({
     *     "templating"     = @DI\Inject("templating"),
     *     "om"             = @DI\Inject("claroline.persistence.object_manager"),
     *     "config"                 = @DI\Inject("claroline.config.platform_config_handler"),
     *     "serializer"     = @DI\Inject("claroline.api.serializer"),
     *     "chapterManager" = @DI\Inject("icap.lesson.manager.chapter")
     * })
     *
     * @param EngineInterface              $templating
     * @param ObjectManager                $om
     * @param PlatformConfigurationHandler $config
     * @param SerializerProvider           $serializer
     * @param ChapterManager               $chapterManager
     */
    public function __construct(
        EngineInterface $templating,
        ObjectManager $om,
        PlatformConfigurationHandler $config,
        SerializerProvider $serializer,
        ChapterManager $chapterManager
    ) {
        $this->templating = $templating;
        $this->om = $om;
        $this->config = $config;
        $this->serializer = $serializer;
        $this->chapterManager = $chapterManager;

        $this->chapterRepository = $this->om->getRepository('IcapLessonBundle:Chapter');
    }

    /**
     * Loads a lesson.
     *
     * @DI\Observe("resource.icap_lesson.load")
     *
     * @param LoadResourceEvent $event
     */
    public function onLoad(LoadResourceEvent $event)
    {
        /** @var Lesson $lesson */
        $lesson = $event->getResource();
        $firstChapter = $this->chapterRepository->getFirstChapter($lesson);
        $root = $this->chapterRepository->findOneBy(['lesson' => $lesson, 'level' => 0, 'parent' => null]);

        $event->setData([
            'exportPdfEnabled' => $this->config->getParameter('is_pdf_export_active'),
            'lesson' => $this->serializer->serialize($lesson),
            'tree' => $this->chapterManager->serializeChapterTree($lesson),
            'chapter' => $firstChapter ? $this->serializer->serialize($firstChapter) : null,
            'root' => $root ? $this->serializer->serialize($root) : null,
        ]);

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_icap_lesson")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        /** @var Lesson $lesson */
        $lesson = $event->getResource();

        $content = $this->templating->render(
            'IcapLessonBundle:lesson:open.html.twig', [
                '_resource' => $lesson,
                'chapter' => $this->chapterRepository->getFirstChapter($lesson),
                'tree' => $this->chapterManager->serializeChapterTree($lesson),
                'root' => $lesson->getRoot(),
            ]
        );

        $event->setResponse(new Response($content));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("resource.icap_lesson.copy")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        /** @var Lesson $lesson */
        $lesson = $event->getResource();

        $newLesson = $event->getCopy();
        $newRoot = new Chapter();
        $newRoot->setLesson($newLesson);
        $newLesson->setRoot($newRoot);

        $this->om->persist($newRoot);
        $this->om->persist($newLesson);
        $this->om->flush();

        $this->chapterManager->copyRoot($lesson->getRoot(), $newLesson->getRoot());

        $event->setCopy($newLesson);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("transfer.icap_lesson.export")
     */
    public function onExport(ExportObjectEvent $exportEvent)
    {
        $lesson = $exportEvent->getObject();

        $data = [
          'root' => $this->chapterManager->serializeChapterTree($lesson),
        ];

        $exportEvent->overwrite('_data', $data);
    }

    /**
     * @DI\Observe("transfer.icap_lesson.import.after")
     */
    public function onImport(ImportObjectEvent $event)
    {
        $data = $event->getData();
        $lesson = $event->getObject();

        $rootChapter = $data['_data']['root'];
        $lesson->buildRoot();
        $root = $lesson->getRoot();

        if (isset($rootChapter['children'])) {
            $children = $rootChapter['children'];

            foreach ($children as $child) {
                $chapter = $this->importChapter($child, $lesson);
                $chapter->setLesson($lesson);
                $chapter->setParent($root);
                $this->om->persist($chapter);
            }
        }
    }

    private function importChapter(array $data = [], Lesson $lesson)
    {
        $chapter = new Chapter();
        $chapter->setTitle($data['title']);
        $chapter->setText($data['text']);

        if (isset($data['children'])) {
            foreach ($data['children'] as $child) {
                $childChap = $this->importChapter($child, $lesson);
                $childChap->setParent($chapter);
            }
        }

        $chapter->setLesson($lesson);
        $this->om->persist($chapter);

        return $chapter;
    }

    /**
     * @DI\Observe("delete_icap_lesson")
     *
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $event->stopPropagation();
    }
}
