<?php

namespace Icap\LessonBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Doctrine\ORM\EntityManager;
use Icap\LessonBundle\Entity\Chapter;
use Icap\LessonBundle\Entity\Lesson;
use Icap\LessonBundle\Event\Log\LogChapterCreateEvent;
use Icap\LessonBundle\Event\Log\LogChapterDeleteEvent;
use Icap\LessonBundle\Event\Log\LogChapterMoveEvent;
use Icap\LessonBundle\Event\Log\LogChapterUpdateEvent;
use Icap\LessonBundle\Serializer\ChapterSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @DI\Service("icap.lesson.manager.chapter")
 */
class ChapterManager
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $entityManager;

    /** @var ChapterSerializer */
    protected $chapterSerializer;

    /** @var ObjectManager */
    protected $om;

    /** @var EventDispatcherInterface */
    protected $eventDispatcher;

    /** @var ChapterRepository */
    protected $chapterRepository;

    /**
     * Constructor.
     *
     * @DI\InjectParams({
     *     "entityManager"     = @DI\Inject("doctrine.orm.entity_manager"),
     *     "chapterSerializer" = @DI\Inject("icap.serializer.lesson.chapter"),
     *     "om"                = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventDispatcher"   = @DI\Inject("event_dispatcher")
     * })
     *
     * @param EntityManager     $entityManager
     * @param ChapterSerializer $chapterSerializer
     * @param ObjectManager     $om
     * @param $eventDispatcher  $eventDispatcher
     */
    public function __construct(
        EntityManager $entityManager,
        ChapterSerializer $chapterSerializer,
        ObjectManager $om,
        EventDispatcherInterface $eventDispatcher
    ) {
        $this->entityManager = $entityManager;
        $this->chapterSerializer = $chapterSerializer;
        $this->om = $om;
        $this->eventDispatcher = $eventDispatcher;
        $this->chapterRepository = $entityManager->getRepository('IcapLessonBundle:Chapter');
    }

    /**
     * Copy full lesson chapters, from original root to copy root.
     *
     * @param Chapter $root_original
     * @param Chapter $root_copy
     */
    public function copyRoot(Chapter $root_original, Chapter $root_copy)
    {
        $this->copyChildren($root_original, $root_copy, true);
    }

    /**
     * Copy chapter_org subchapters into provided chapter_copy.
     *
     * @param Chapter $chapter_org
     * @param Chapter $parent
     * @param bool    $copy_children
     * @param Lesson  $copyName
     *
     * @return Chapter $chapter_copy
     */
    public function copyChapter(Chapter $chapter_org, Chapter $parent, $copy_children, $copyName = null)
    {
        $chapter_copy = new Chapter();
        if (!$copyName) {
            $copyName = $chapter_org->getTitle();
        }
        $chapter_copy->setTitle($copyName);
        $chapter_copy->setText($chapter_org->getText());
        $chapter_copy->setLesson($parent->getLesson());
        $this->insertChapter($chapter_copy, $parent);
        if ($copy_children) {
            $this->copyChildren($chapter_org, $chapter_copy, $copy_children);
        }

        return $chapter_copy;
    }

    public function copyChildren(Chapter $chapter_org, Chapter $chapter_copy, $copy_children)
    {
        $chapterRepository = $this->entityManager->getRepository('IcapLessonBundle:Chapter');
        $chapters = $chapterRepository->children($chapter_org, true);
        if (null !== $chapters && count($chapters) > 0) {
            foreach ($chapters as $child) {
                $this->copyChapter($child, $chapter_copy, $copy_children);
            }
        }
    }

    public function insertChapter(Chapter $chapter, Chapter $parent)
    {
        $this->entityManager->getRepository('IcapLessonBundle:Chapter')->persistAsLastChildOf($chapter, $parent);
        $this->entityManager->flush();
    }

    public function serializeChapterTree(Lesson $lesson)
    {
        $tree = $this->entityManager->getRepository('IcapLessonBundle:Chapter')->buildChapterTree($lesson->getRoot(), 'chapter.uuid, chapter.level, chapter.title, chapter.slug');

        return $this->chapterSerializer->serializeChapterTree($tree[0]);
    }

    public function createChapter(Lesson $lesson, $data, $parent)
    {
        $newChapter = $this->chapterSerializer->deserialize($data);
        $newChapter->setLesson($lesson);

        $this->insertChapterInPlace($newChapter, $parent, $data);

        $this->dispatch(new LogChapterCreateEvent($lesson, $newChapter, []));

        return $newChapter;
    }

    public function updateChapter(lesson $lesson, Chapter $chapter, $data)
    {
        $oldParent = $chapter->getParent();
        $newParent = $this->chapterRepository->findOneBySlug($data['parentSlug']);

        $this->chapterSerializer->deserialize($data, $chapter);

        // Should the chapter be moved ?
        if (isset($data['move'])) {
            $this->insertChapterInPlace($chapter, $newParent, $data);
            $this->dispatch(new LogChapterMoveEvent($chapter->getLesson(), $chapter, $oldParent, $chapter->getParent()));
        } else {
            $this->om->persist($chapter);
            $this->om->flush();
        }

        $this->dispatch(new LogChapterUpdateEvent($lesson, $chapter, []));
    }

    public function deleteChapter(Lesson $lesson, Chapter $chapter, $withChildren = false)
    {
        if ($withChildren) {
            $this->om->remove($chapter);
        } else {
            $this->chapterRepository->removeFromTree($chapter);
        }

        $this->om->flush();

        $this->dispatch(new LogChapterDeleteEvent($lesson, $chapter, []));
    }

    private function insertChapterInPlace($chapter, $parent, $data)
    {
        $position = $data['position'];
        $sibling = $data['order']['sibling'];
        $subchapter = $data['order']['subchapter'];

        switch ($position) {
            case 'subchapter':
                switch ($subchapter) {
                    case 'first':
                        $this->chapterRepository->persistAsFirstChildOf($chapter, $parent);
                        break;
                    case 'last':
                    default:
                        $this->chapterRepository->persistAsLastChildOf($chapter, $parent);
                        break;
                }
                break;
            case 'sibling':
            default:
                switch ($sibling) {
                    case 'before':
                        $previousChapter = $this->chapterRepository->getPreviousSibling($parent);
                        if ($previousChapter) {
                            $this->chapterRepository->persistAsNextSiblingOf($chapter, $previousChapter);
                        } else {
                            $this->chapterRepository->persistAsFirstChildOf($chapter, $parent->getParent());
                        }
                        break;
                    case 'after':
                    default:
                        $this->chapterRepository->persistAsNextSiblingOf($chapter, $parent);
                        break;
                }
                break;
        }

        $this->om->persist($chapter);
        $this->om->flush();
    }

    private function dispatch($event)
    {
        $this->eventDispatcher->dispatch('log', $event);
    }
}
