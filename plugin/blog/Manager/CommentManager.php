<?php

namespace Icap\BlogBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\Comment;
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Repository\CommentRepository;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("icap.blog.manager.comment")
 */
class CommentManager
{
    /**
     * @var ObjectManager
     */
    protected $om;
    private $finder;

    /** @var \Icap\BlogBundle\Repository\CommentRepository */
    protected $repo;

    /**
     * @DI\InjectParams({
     *     "om"     = @DI\Inject("claroline.persistence.object_manager"),
     *     "repo"   = @DI\Inject("icap.blog.comment_repository"),
     *     "finder" = @DI\Inject("claroline.api.finder")
     * })
     *
     * @param ObjectManager     $om
     * @param CommentRepository $repo
     * @param FinderProvider    $finder
     */
    public function __construct(
        ObjectManager $om,
        CommentRepository $repo,
        FinderProvider $finder)
    {
        $this->om = $om;
        $this->repo = $repo;
        $this->finder = $finder;
    }

    /**
     * Find all content for a given user and the replace him by another.
     *
     * @param User $from
     * @param User $to
     *
     * @return int
     */
    public function replaceCommentAuthor(User $from, User $to)
    {
        $comments = $this->repo->findByAuthor($from);

        if (count($comments) > 0) {
            foreach ($comments as $comment) {
                $comment->setAuthor($to);
            }

            $this->om->flush();
        }

        return count($comments);
    }

    /**
     * Get unpublished comments.
     *
     * @param $blogId
     * @param $filters
     *
     * @return array
     */
    public function getUnpublishedComments($blogId, $filters)
    {
        if (!isset($filters['hiddenFilters'])) {
            $filters['hiddenFilters'] = [];
        }
        //filter on current blog and post
        $filters['hiddenFilters'] = array_merge(
            $filters['hiddenFilters'],
            [
                'blog' => $blogId,
                'status' => false,
            ]);

        return $this->finder->search('Icap\BlogBundle\Entity\Comment', $filters);
    }

    /**
     * Get comments.
     *
     * @param $blogId
     * @param $postId
     * @param $userId
     * @param $filters
     * @param $allowedToSeeOnly
     */
    public function getComments($blogId, $postId, $userId, $filters, $allowedToSeeOnly)
    {
        if (!isset($filters['hiddenFilters'])) {
            $filters['hiddenFilters'] = [];
        }
        //filter on current blog and post
        $filters['hiddenFilters'] = [
            'blog' => $blogId,
            'post' => $postId,
        ];

        //allow to see only published post, or post whose current user is the author
        if ($allowedToSeeOnly) {
            //anonymous only sees published
            if (null === $userId) {
                $options = [
                    'publishedOnly' => true,
                ];
            } else {
                $options = [
                    'allowedToSeeForUser' => $userId,
                ];
            }

            $filters['hiddenFilters'] = array_merge(
                $filters['hiddenFilters'],
                $options);
        }

        return $this->finder->search('Icap\BlogBundle\Entity\Comment', $filters);
    }
}
