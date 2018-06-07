<?php

namespace Icap\WikiBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Icap\WikiBundle\Entity\Contribution;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Entity\Wiki;
use Icap\WikiBundle\Serializer\SectionSerializer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.wiki.section_manager")
 */
class SectionManager
{
    /** @var ObjectManager */
    protected $om;

    /** @var \Icap\WikiBundle\Repository\SectionRepository */
    protected $sectionRepository;

    /** @var SectionSerializer */
    protected $sectionSerializer;

    /**
     * @DI\InjectParams({
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "sectionSerializer"      = @DI\Inject("claroline.serializer.wiki.section")
     * })
     *
     * @param ObjectManager     $om
     * @param SectionSerializer $sectionSerializer
     */
    public function __construct(
        ObjectManager $om,
        SectionSerializer $sectionSerializer
    ) {
        $this->om = $om;
        $this->sectionRepository = $om->getRepository('Icap\WikiBundle\Entity\Section');
        $this->sectionSerializer = $sectionSerializer;
    }

    public function getSerializedSectionTree(Wiki $wiki, User $user = null, $isAdmin = false)
    {
        $tree = $this->sectionRepository->buildSectionTree($wiki, $user, $isAdmin);

        return $this->sectionSerializer->serializeSectionTreeNode($wiki, $tree[0]);
    }

    public function setActiveContribution(Section $section, Contribution $contribution)
    {
        $section->setActiveContribution($contribution);
        $this->om->persist($section);
        $this->om->flush();
    }

    public function getArchivedSectionsForPosition(Section $section)
    {
        $sections = $this->sectionRepository->findSectionsForPosition($section);
        $archivedSections = [];
        $prefixesArray = [];
        $childrens = [];
        foreach ($sections as $simpleSection) {
            if (isset($childrens[$simpleSection['parentId']])) {
                ++$childrens[$simpleSection['parentId']];
            } else {
                $childrens[$simpleSection['parentId']] = 1;
            }
            if (isset($prefixesArray[$simpleSection['parentId']])) {
                $prefix = $prefixesArray[$simpleSection['parentId']].$childrens[$simpleSection['parentId']];
            } else {
                $prefix = $childrens[$simpleSection['parentId']];
            }
            $archivedSections[$simpleSection['id']] = $prefix.' '.$simpleSection['title'];
            $prefixesArray[$simpleSection['id']] = '&nbsp;'.$prefix.'.';
        }

        return $archivedSections;
    }

    /**
     * Find all content for a given user and the replace him by another.
     *
     * @param User $from
     * @param User $to
     *
     * @return int
     */
    public function replaceUser(User $from, User $to)
    {
        $sections = $this->sectionRepository->findByAuthor($from);

        if (count($sections) > 0) {
            foreach ($sections as $section) {
                $section->setAuthor($to);
            }

            $this->om->flush();
        }

        return count($sections);
    }
}
