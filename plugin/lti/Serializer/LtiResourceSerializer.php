<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace UJM\LtiBundle\Serializer;

use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\AppBundle\API\SerializerProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\LtiBundle\Entity\LtiApp;
use UJM\LtiBundle\Entity\LtiResource;

/**
 * @DI\Service("claroline.serializer.lti.resource")
 * @DI\Tag("claroline.serializer")
 */
class LtiResourceSerializer
{
    use SerializerTrait;

    /** @var SerializerProvider */
    private $serializer;

    private $ltiAppRepo;

    /**
     * LtiResourceSerializer constructor.
     *
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "serializer" = @DI\Inject("claroline.api.serializer")
     * })
     *
     * @param ObjectManager      $om
     * @param SerializerProvider $serializer
     */
    public function __construct(ObjectManager $om, SerializerProvider $serializer)
    {
        $this->serializer = $serializer;

        $this->ltiAppRepo = $om->getRepository(LtiApp::class);
    }

    /**
     * Serializes a LTI resource for the JSON api.
     *
     * @param LtiResource $ltiResource - the LTI resource to serialize
     * @param array       $options     - a list of serialization options
     *
     * @return array - the serialized representation of the LTI resource
     */
    public function serialize(LtiResource $ltiResource, array $options = [])
    {
        $serialized = [
            'id' => $ltiResource->getUuid(),
            'openInNewTab' => $ltiResource->getOpenInNewTab(),
            'ratio' => $ltiResource->getRatio(),
            'ltiApp' => $ltiResource->getLtiApp() ?
                $this->serializer->serialize($ltiResource->getLtiApp(), [Options::SERIALIZE_MINIMAL]) :
                null,
        ];

        return $serialized;
    }

    /**
     * @param array       $data
     * @param LtiResource $ltiResource
     *
     * @return LtiResource
     */
    public function deserialize($data, LtiResource $ltiResource)
    {
        $this->sipe('openInNewTab', 'setOpenInNewTab', $data, $ltiResource);
        $this->sipe('ratio', 'setRatio', $data, $ltiResource);

        $ltiApp = isset($data['ltiApp']['id']) ?
            $this->ltiAppRepo->findOneBy(['uuid' => $data['ltiApp']['id']]) :
            null;
        $ltiResource->setLtiApp($ltiApp);

        return $ltiResource;
    }
}
