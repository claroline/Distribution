<?php

namespace Icap\WikiBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Repository\UserRepository;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Entity\Wiki;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.wiki.section")
 * @DI\Tag("claroline.serializer")
 */
class SectionSerializer
{
    use SerializerTrait;

    /** @var ContributionSerializer */
    private $contributionSerializer;

    /** @var UserRepository */
    private $userRepo;

    /**
     * SectionSerializer constructor.
     *
     * * @DI\InjectParams({
     *     "contributionSerializer"     = @DI\Inject("claroline.serializer.wiki.section.contribution"),
     *     "om"                         = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ContributionSerializer $contributionSerializer
     */
    public function __construct(
        ContributionSerializer $contributionSerializer,
        ObjectManager $om
    ) {
        $this->contributionSerializer = $contributionSerializer;
        $this->userRepo = $om->getRepository('Claroline\CoreBundle\Entity\User');
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return 'Icap\WikiBundle\Entity\Section';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/wiki/section.json';
    }

    /**
     * @param Section $section
     *
     * @return array - The serialized representation of a contribution
     */
    public function serialize(Section $section)
    {
        $author = $section->getAuthor();

        return [
            'id' => $section->getUuid(),
            'wiki' => $section->getWiki()->getUuid(),
            'parent' => null !== $section->getParent() ? $section->getParent()->getUuid() : null,
            'creationDate' => $section->getCreationDate()->format('Y-m-d H:i'),
            'visible' => $section->getVisible(),
            'activeContribution' => $this->contributionSerializer->serialize($section->getActiveContribution()),
            'author' => null === $author ? null : [
                'id' => $author->getUuid(),
                'firstName' => $author->getFirstName(),
                'lastName' => $author->getLastName(),
                'email' => $author->getEmail(),
            ],
        ];
    }

    /**
     * Serializes a section tree, returned from Gedmo tree extension.
     *
     * @param Wiki $wiki
     * @param $tree
     *
     * @return array
     */
    public function serializeSectionTree(Wiki $wiki, $tree)
    {
        return $this->serializeSectionTreeNode($wiki, $tree[0]);
    }

    public function serializeSectionTreeNode(Wiki $wiki, $node, $parent = null)
    {
        $children = [];
        if (!empty($node['__children'])) {
            foreach ($node['__children'] as $child) {
                $children[] = $this->serializeSectionTreeNode($wiki, $child, $node);
            }
        }

        return [
            'id' => $node['uuid'],
            'wiki' => $wiki->getUuid(),
            'parent' => null !== $parent ? $parent['uuid'] : null,
            'creationDate' => $node['creationDate']->format('Y-m-d H:i'),
            'visible' => $node['visible'],
            'activeContribution' => $this->contributionSerializer->serializeFromSectionNode($node),
            'children' => $children,
        ];
    }

    /**
     * @param array          $data
     * @param Section | null $section
     *
     * @return Section - The deserialized section entity
     */
    public function deserialize($data, Section $section = null)
    {
        if (empty($section)) {
            $section = new Section();
        }
        $this->sipe('id', 'setUuid', $data, $section);
        $this->sipe('visible', 'setVisible', $data, $section);
        if ($data['author']) {
            $user = $this->userRepo->findOneBy(['uuid' => $data['author']['id']]);
            $section->setAuthor($user);
        }

        return $section;
    }
}
