<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\Resource\Revision;
use Claroline\CoreBundle\Entity\Resource\Text;
use Claroline\CoreBundle\Entity\User;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;

/**
 * @DI\Service("claroline.manager.text_manager")
 */
class TextManager
{
    /** @var EventDispatcherInterface */
    private $eventDispatcher;

    /** @var ObjectManager */
    private $om;

    /** @var UserManager */
    private $userManager;

    /**
     * @DI\InjectParams({
     *     "eventDispatcher" = @DI\Inject("event_dispatcher"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "userManager"     = @DI\Inject("claroline.manager.user_manager")
     * })
     *
     * @param EventDispatcherInterface $eventDispatcher
     * @param ObjectManager            $om
     * @param UserManager              $userManager
     */
    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        ObjectManager $om,
        UserManager $userManager
    ) {
        $this->eventDispatcher = $eventDispatcher;
        $this->om = $om;
        $this->userManager = $userManager;
    }

    public function create($content, $title, User $user = null)
    {
        $revision = new Revision();
        $revision->setContent($content);
        $revision->setUser($user);
        $text = new Text();
        $text->setName($title);
        $revision->setText($text);
        $this->om->persist($text);
        $this->om->persist($revision);
        $this->om->flush();

        return $text;
    }

    public function getLastContentRevision(Text $text)
    {
        $revisionRepo = $this->om->getRepository('ClarolineCoreBundle:Resource\Revision');

        return $revisionRepo->getLastRevision($text)->getContent();
    }
}
