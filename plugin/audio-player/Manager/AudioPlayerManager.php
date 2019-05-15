<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\AudioPlayerBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AudioPlayerBundle\Entity\Resource\AudioParams;
use Claroline\AudioPlayerBundle\Entity\Resource\SectionComment;
use Claroline\CoreBundle\Entity\Resource\ResourceNode;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.audio_player")
 */
class AudioPlayerManager
{
    /** @var ObjectManager */
    private $om;

    private $audioParamsRepo;
    private $sectionCommentRepo;

    /**
     * @DI\InjectParams({
     *     "om" = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param ObjectManager $om
     */
    public function __construct(ObjectManager $om)
    {
        $this->om = $om;

        $this->audioParamsRepo = $om->getRepository(AudioParams::class);
        $this->sectionCommentRepo = $om->getRepository(SectionComment::class);
    }

    public function getAudioParams(ResourceNode $resourceNode)
    {
        $audioParams = $this->audioParamsRepo->findOneBy(['node' => $resourceNode]);

        if (!$audioParams) {
            $audioParams = new AudioParams();
            $audioParams->setNode($resourceNode);
            $this->om->persist($audioParams);
            $this->om->flush();
        }

        return $audioParams;
    }
}
