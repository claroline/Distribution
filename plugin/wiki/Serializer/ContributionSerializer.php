<?php

namespace Icap\WikiBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Claroline\CoreBundle\Repository\UserRepository;
use Icap\WikiBundle\Entity\Contribution;
use Icap\WikiBundle\Entity\Section;
use Icap\WikiBundle\Repository\SectionRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.wiki.section.contribution")
 * @DI\Tag("claroline.serializer")
 */
class ContributionSerializer
{
    use SerializerTrait;

    /** @var SectionRepository */
    private $sectionRepo;

    /** @var UserRepository */
    private $userRepo;

    /** @var UserSerializer */
    private $userSerializer;

    /**
     * ContributionSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "userSerializer"     = @DI\Inject("claroline.serializer.user")
     * })
     */
    public function __construct(
        ObjectManager $om,
        UserSerializer $userSerializer
    ) {
        $this->userRepo = $om->getRepository('Claroline\CoreBundle\Entity\User');
        $this->sectionRepo = $om->getRepository('Icap\WikiBundle\Entity\Section');
        $this->userSerializer = $userSerializer;
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return 'Icap\WikiBundle\Entity\Contribution';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/wiki/contribution.json';
    }

    /**
     * @param Contribution $contribution
     *
     * @return array - The serialized representation of a contribution
     */
    public function serialize(Contribution $contribution)
    {
        $contributor = $contribution->getContributor();

        return [
            'id' => $contribution->getUuid(),
            'title' => $contribution->getTitle(),
            'text' => $contribution->getText(),
            'section' => $contribution->getSection()->getUuid(),
            'meta' => [
                'createdAt' => $contribution->getCreationDate()->format('Y-m-d H:i'),
                'creator' => null === $contributor ?
                    null :
                    $this->userSerializer->serialize($contributor, Options::SERIALIZE_MINIMAL),
            ],
        ];
    }

    public function serializeFromSectionNode($sectionNode)
    {
        $contribution = $sectionNode['activeContribution'];

        return [
            'id' => $contribution['uuid'],
            'title' => $contribution['title'],
            'text' => $contribution['text'],
            'section' => $sectionNode['uuid'],
            'meta' => [
                'createdAt' => $contribution['meta']['createdAt']->format('Y-m-d H:i'),
            ],
        ];
    }

    /**
     * @param array               $data
     * @param Contribution | null $contribution
     *
     * @return Contribution - The deserialized contribution entity
     */
    public function deserialize($data, Contribution $contribution = null)
    {
        if (empty($contribution)) {
            $contribution = new Contribution();
            /** @var Section $section */
            $section = $this->sectionRepo->findOneBy(['uuid' => $data['section']]);
            $contribution->setSection($section);
        }
        $this->sipe('id', 'setUuid', $data, $contribution);
        $this->sipe('title', 'setTitle', $data, $contribution);
        $this->sipe('text', 'setText', $data, $contribution);
        if ($data['meta']['creator']) {
            $user = $this->userRepo->findOneBy(['uuid' => $data['meta']['creator']['id']]);
            $contribution->setContributor($user);
        }

        return $contribution;
    }
}
