<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CursusBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use Claroline\CursusBundle\Entity\SessionEvent;
use Claroline\CursusBundle\Repository\CourseSessionRepository;
use Claroline\CursusBundle\Repository\SessionEventSetRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.cursus.event")
 * @DI\Tag("claroline.serializer")
 */
class SessionEventSerializer
{
    use SerializerTrait;

    /** @var ObjectManager */
    private $om;
    /** @var SessionEventSetSerializer */
    private $eventSetSerializer;
    /** @var SessionSerializer */
    private $sessionSerializer;

    /** @var SessionEventSetRepository */
    private $eventSetRepo;
    /** @var CourseSessionRepository */
    private $sessionRepo;

    /**
     * SessionSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager"),
     *     "eventSetSerializer" = @DI\Inject("claroline.serializer.cursus.event.set"),
     *     "sessionSerializer"  = @DI\Inject("claroline.serializer.cursus.session")
     * })
     *
     * @param ObjectManager             $om
     * @param SessionEventSetSerializer $eventSetSerializer
     * @param SessionSerializer         $sessionSerializer
     */
    public function __construct(
        ObjectManager $om,
        SessionEventSetSerializer $eventSetSerializer,
        SessionSerializer $sessionSerializer
    ) {
        $this->om = $om;
        $this->eventSetSerializer = $eventSetSerializer;
        $this->sessionSerializer = $sessionSerializer;

        $this->eventSetRepo = $om->getRepository('Claroline\CursusBundle\Entity\SessionEventSet');
        $this->sessionRepo = $om->getRepository('Claroline\CursusBundle\Entity\CourseSession');
    }

    /**
     * @param SessionEvent $event
     * @param array        $options
     *
     * @return array
     */
    public function serialize(SessionEvent $event, array $options = [])
    {
        $serialized = [
            'id' => $event->getUuid(),
            'name' => $event->getName(),
            'description' => $event->getDescription(),
        ];

        if (!in_array(Options::SERIALIZE_MINIMAL, $options)) {
            $serialized = array_merge($serialized, [
                'meta' => [
                    'type' => $event->getType(),
                    'session' => $this->sessionSerializer->serialize($event->getSession(), [Options::SERIALIZE_MINIMAL]),
                    'set' => $event->getEventSet() ? $event->getEventSet()->getName() : null,
                ],
                'restrictions' => [
                    'maxUsers' => $event->getMaxUsers(),
                    'dates' => [
                        $event->getStartDate() ? DateNormalizer::normalize($event->getStartDate()) : null,
                        $event->getEndDate() ? DateNormalizer::normalize($event->getEndDate()) : null,
                    ],
                ],
                'registration' => [
                    'registrationType' => $event->getRegistrationType(),
                ],
            ]);
        }

        return $serialized;
    }

    /**
     * @param array        $data
     * @param SessionEvent $event
     *
     * @return SessionEvent
     */
    public function deserialize($data, SessionEvent $event)
    {
        $this->sipe('id', 'setUuid', $data, $event);
        $this->sipe('name', 'setName', $data, $event);
        $this->sipe('description', 'setDescription', $data, $event);

        $this->sipe('meta.type', 'setType', $data, $event);

        $this->sipe('restrictions.maxUsers', 'setMaxUsers', $data, $event);

        $this->sipe('registration.registrationType', 'setRegistrationType', $data, $event);

        $startDate = isset($data['restrictions']['dates'][0]) ?
            DateNormalizer::denormalize($data['restrictions']['dates'][0]) :
            null;
        $endDate = isset($data['restrictions']['dates'][1]) ?
            DateNormalizer::denormalize($data['restrictions']['dates'][1]) :
            null;
        $event->setStartDate($startDate);
        $event->setEndDate($endDate);

        $session = $event->getSession();

        if (empty($session) && isset($data['meta']['session']['id'])) {
            $session = $this->sessionRepo->findOneBy(['uuid' => $data['meta']['session']['id']]);

            if ($session) {
                $event->setSession($session);
            }
        }
        if ($session && isset($data['meta']['set']) && !empty($data['meta']['set'])) {
            $eventSet = $this->eventSetRepo->findSessionEventSetBySessionAndName($session, $data['meta']['set']);

            if (empty($eventSet)) {
                $set = new SessionEventSet();
                $set->setSession($session);
                $set->setName($data['meta']['set']);
                $this->om->persist($set);
            }
            $event->setEventSet($eventSet);
        } else {
            $event->setEventSet(null);
        }

        return $event;
    }
}
