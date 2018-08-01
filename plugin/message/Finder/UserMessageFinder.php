<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\MessageBundle\Finder;

use Claroline\AppBundle\API\Finder\AbstractFinder;
use Claroline\MessageController\Entity\UserMessage;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.user_message")
 * @DI\Tag("claroline.finder")
 */
class UserMessageFinder extends AbstractFinder
{
    public function getClass()
    {
        return UserMessage::class;
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        return $qb;
    }
}
