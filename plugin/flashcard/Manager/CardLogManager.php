<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\FlashCardBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\FlashCardBundle\Entity\Card;
use Claroline\FlashCardBundle\Entity\CardLog;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;

/**
 * @DI\Service("claroline.flashcard.card_log_manager")
 */
class CardLogManager
{
    private $om;
    private $templating;

    /**
     * @DI\InjectParams({
     *     "om"         = @DI\Inject("claroline.persistence.object_manager"),
     *     "templating" = @DI\Inject("templating")
     * })
     *
     * @param ObjectManager   $om
     * @param EngineInterface $templating
     */
    public function __construct(ObjectManager $om, EngineInterface $templating)
    {
        $this->om = $om;
        $this->templating = $templating;
    }

    /**
     * @param CardLog $cardLog
     *
     * @return CardLog
     */
    public function save(CardLog $cardLog)
    {
        $this->om->persist($cardLog);
        $this->om->flush();

        return $cardLog;
    }

    /**
     * @param CardLog $cardLog
     */
    public function delete(CardLog $cardLog)
    {
        $this->om->remove($cardLog);
        $this->om->flush();
    }

    /**
     * @param Card $card
     */
    public function getLastLog(Card $card, User $user)
    {
        $repo = $this->om->getRepository('ClarolineFlashCardBundle:CardLog');

        return $repo->findOneByCardAndUserOrderByDate($card, $user);
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
        $cardLogs = $this->om->getRepository('ClarolineFlashCardBundle:CardLog')->findByUser($from);

        if (count($cardLogs) > 0) {
            foreach ($cardLogs as $cardLog) {
                $cardLog->setUser($to);
            }

            $this->om->flush();
        }

        return count($cardLogs);
    }
}
