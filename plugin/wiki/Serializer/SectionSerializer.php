<?php

namespace Icap\WikiBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
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

    /** @var UserSerializer */
    private $userSerializer;

    /**
     * SectionSerializer constructor.
     *
     * * @DI\InjectParams({
     *     "om"                         = @DI\Inject("claroline.persistence.object_manager"),
     *     "contributionSerializer"     = @DI\Inject("claroline.serializer.wiki.section.contribution"),
     *     "userSerializer"             = @DI\Inject("claroline.serializer.user")
     * })
     *
     * @param ContributionSerializer $contributionSerializer
     */
    public function __construct(
        ObjectManager $om,
        ContributionSerializer $contributionSerializer,
        UserSerializer $userSerializer
    ) {
        $this->contributionSerializer = $contributionSerializer;
        $this->userSerializer = $userSerializer;
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
            'activeContribution' => $this->contributionSerializer->serialize($section->getActiveContribution()),
            'meta' => [
                'createdAt' => $section->getCreationDate()->format('Y-m-d H:i'),
                'visible' => $section->getVisible(),
                'creator' => null === $author ?
                    null :
                    $this->userSerializer->serialize($author, Options::SERIALIZE_MINIMAL),
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

    public function serializeSectionTreeNode(Wiki $wiki, $node)
    {
        $children = [];
        if (!empty($node['__children'])) {
            foreach ($node['__children'] as $child) {
                $children[] = $this->serializeSectionTreeNode($wiki, $child);
            }
        }

        return [
            'id' => $node['uuid'],
            'meta' => [
                'createdAt' => $node['creationDate']->format('Y-m-d H:i'),
            ],
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
        if ($data['meta']['visible']) {
            $section->setVisible($data['meta']['visible']);
        }
        if ($data['meta']['creator']) {
            $user = $this->userRepo->findOneBy(['uuid' => $data['meta']['creator']['id']]);
            $section->setAuthor($user);
        }

        return $section;
    }
}
