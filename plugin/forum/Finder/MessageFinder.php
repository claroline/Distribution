<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ForumBundle\Finder;

use Claroline\AppBundle\API\Finder\FinderTrait;
use Claroline\AppBundle\API\FinderInterface;
use Doctrine\ORM\QueryBuilder;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.api.finder.forum_message")
 * @DI\Tag("claroline.finder")
 */
class MessageFinder implements FinderInterface
{
    use FinderTrait;

    public function getClass()
    {
        return 'Claroline\ForumBundle\Entity\Message';
    }

    public function configureQueryBuilder(QueryBuilder $qb, array $searches = [], array $sortBy = null)
    {
        foreach ($searches as $filterName => $filterValue) {
            switch ($filterName) {
              case 'subject':
                $qb->leftJoin('obj.subject', 'subject');
                if (is_null($filterValue)) {
                    $qb->andWhere('subject IS NULL');
                } else {
                    $qb->andWhere($qb->expr()->orX(
                        $qb->expr()->eq('subject.id', ':'.$filterName),
                        $qb->expr()->eq('subject.uuid', ':'.$filterName)
                    ));
                    $qb->setParameter($filterName, $filterValue);
                }
                break;
              case 'parent':
                $qb->leftJoin('obj.parent', 'parent');
                $qb->andWhere($qb->expr()->orX(
                    $qb->expr()->eq('parent.id', ':'.$filterName),
                    $qb->expr()->eq('parent.uuid', ':'.$filterName)
                ));
                $qb->setParameter($filterName, $filterValue);
                break;
              case 'forum':
                $qb->leftJoin('obj.subject', 'sf');
                $qb->leftJoin('sf.forum', 'forum');
                $qb->andWhere($qb->expr()->orX(
                    $qb->expr()->eq('forum.id', ':'.$filterName),
                    $qb->expr()->eq('forum.uuid', ':'.$filterName)
                ));
                $qb->setParameter($filterName, $filterValue);
                break;
              default:
                $this->setDefaults($qb, $filterName, $filterValue);
            }
        }

        return $qb;
    }

    public function getFilters()
    {
        return [
          'subject' => [
            'type' => ['integer', 'string'],
            'description' => 'The parent subject id (int) or uuid (string)',
          ],
          'parent' => [
            'type' => ['integer', 'string'],
            'description' => 'The parent message id (int) or uuid (string)',
          ],
          'isVisible' => [
            'type' => 'boolean',
            'description' => 'If the message is visible',
          ],
          'content' => [
            'type' => 'string',
            'description' => 'The message content',
          ],
          'creationDate' => [
            'type' => 'datetime',
            'description' => 'The creation date',
          ],
          'updated' => [
            'type' => 'datetime',
            'description' => 'The last update date',
          ],
          'author' => [
            'type' => 'string',
            'description' => 'the author name',
          ],
        ];
    }
}
