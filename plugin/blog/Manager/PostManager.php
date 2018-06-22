<?php

namespace Icap\BlogBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\Comment;
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Entity\Tag;
use Icap\BlogBundle\Repository\PostRepository;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Translation\TranslatorInterface;

/**
 * @DI\Service("icap.blog.manager.post")
 */
class PostManager
{
    private $om;
    private $trackingManager;
    private $repo;
    private $finder;
    private $translator;

    /**
     * @DI\InjectParams({
     *     "finder"          = @DI\Inject("claroline.api.finder"),
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "trackingManager" = @DI\Inject("icap.blog.manager.tracking"),
     *     "repo"            = @DI\Inject("icap.blog.post_repository"),
     *     "translator"      = @DI\Inject("translator")
     * })
     *
     * @param FinderProvider      $finder
     * @param ObjectManager       $om
     * @param BlogTrackingManager $trackingManager
     * @param PostRepository      $repo
     * @param TranslatorInterface $translator
     */
    public function __construct(
        FinderProvider $finder,
        ObjectManager $om,
        BlogTrackingManager $trackingManager,
        PostRepository $repo,
        TranslatorInterface $translator)
    {
        $this->finder = $finder;
        $this->om = $om;
        $this->repo = $repo;
        $this->trackingManager = $trackingManager;
        $this->translator = $translator;
    }

    /**
     * @param Blog   $blog
     * @param string $postId
     *
     * @return post
     */
    public function getPostByIdOrSlug(Blog $blog, $postId)
    {
        if (preg_match('/^\d+$/', $postId)) {
            $post = $this->repo->findOneBy([
                'blog' => $blog,
                'id' => $postId,
            ]);
        } else {
            $post = $this->repo->findOneBy([
                'blog' => $blog,
                'slug' => $postId,
            ]);
        }

        return $post;
    }

    /**
     * @param Blog $blog
     * @param Tag  $tag
     * @param $filterByPublishPost
     * @param int $page
     *
     * @return array
     */
    public function getPostsByTagPaged(Blog $blog, Tag $tag, $filterByPublishPost, $page = 1)
    {
        $query = $this->repo->getByTag($blog, $tag, $filterByPublishPost, false);

        return $this->setPager($query, $page, $blog->getOptions()->getPostPerPage());
    }

    /**
     * @param Blog $blog
     * @param User $author
     * @param $filterByPublishPost
     * @param int $page
     *
     * @return array
     */
    public function getPostsByAuthorPaged(Blog $blog, User $author, $filterByPublishPost, $page = 1)
    {
        $query = $this->repo->getByAuthor($blog, $author, $filterByPublishPost, false);

        return $this->setPager($query, $page, $blog->getOptions()->getPostPerPage());
    }

    /**
     * @param Blog $blog
     * @param $date
     * @param $filterByPublishPost
     * @param int $page
     *
     * @return array
     */
    public function getPostsByDatePaged(Blog $blog, $date, $filterByPublishPost, $page = 1)
    {
        $query = $this->repo->getByDate($blog, $date, $filterByPublishPost, false);

        return $this->setPager($query, $page, $blog->getOptions()->getPostPerPage());
    }

    /**
     * @param $query
     * @param $page
     * @param $maxPerPage
     *
     * @return array
     */
    private function setPager($query, $page, $maxPerPage)
    {
        $adapter = new DoctrineORMAdapter($query);
        $pager = new PagerFanta($adapter);
        $pager
            ->setMaxPerPage($maxPerPage)
            ->setCurrentPage($page)
        ;

        // Pagerfanta returns a traversable object, not directly serializable
        $posts = [];
        foreach ($pager->getCurrentPageResults() as $post) {
            $posts[] = $post;
        }

        return [
            'total' => $pager->getNbResults(),
            'count' => count($posts),
            'posts' => $posts,
        ];
    }

    /**
     * Find all content for a given user and the replace him by another.
     *
     * @param User $from
     * @param User $to
     *
     * @return int
     */
    public function replacePostAuthor(User $from, User $to)
    {
        $posts = $this->repo->findByAuthor($from);

        if (count($posts) > 0) {
            foreach ($posts as $post) {
                $post->setAuthor($to);
            }

            $this->om->flush();
        }

        return count($posts);
    }

    /**
     * Create a post.
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     */
    public function createPost(Blog $blog, Post $post, User $user)
    {
        $post
        ->setBlog($blog)
        ->setAuthor($user)
        ->setStatus($blog->isAutoPublishPost() ? Post::STATUS_PUBLISHED : Post::STATUS_UNPUBLISHED)
        ->setCreationDate(new \DateTime())
        ->setModificationDate(new \DateTime());

        if (null === $post->getPublicationDate()) {
            $post->setPublicationDate(new \DateTime());
        }

        //tracking
        $this->trackingManager->dispatchPostCreateEvent($blog, $post);
        if ('anon.' !== $user) {
            $this->trackingManager->updateResourceTracking($blog->getResourceNode(), $user, new \DateTime());
        }

        $this->om->persist($post);
        $this->om->flush();

        return $post;
    }

    /**
     * Create a post comment.
     *
     * @param Blog    $blog
     * @param Post    $post
     * @param Comment $comment
     * @param User    $user
     *
     * @return Comment
     */
    public function createComment(Blog $blog, Post $post, Comment $comment, $forcePublication = false)
    {
        $comment
        ->setPost($post)
        ->setStatus($blog->isAutoPublishComment() || $forcePublication ? Comment::STATUS_PUBLISHED : Comment::STATUS_UNPUBLISHED);

        if (null === $comment->getCreationDate()) {
            $comment->setCreationDate(new \DateTime());
        }

        $this->om->persist($comment);
        $this->om->flush();

        $this->trackingManager->dispatchCommentCreateEvent($post, $comment);

        if (null !== $comment->getAuthor()) {
            $this->trackingManager->updateResourceTracking($blog->getResourceNode(), $comment->getAuthor(), new \DateTime());
        }

        return $comment;
    }

    /**
     * Update a comment.
     *
     * @param Blog    $blog
     * @param Post    $post
     * @param Comment $comment
     * @param User    $user
     *
     * @return Comment
     */
    public function updateComment(Blog $blog, Post $post, Comment $existingComment, $message)
    {
        $existingComment
        ->setMessage($message)
        ->setStatus($blog->isAutoPublishComment() ? Comment::STATUS_PUBLISHED : Comment::STATUS_UNPUBLISHED)
        ->setPublicationDate($blog->isAutoPublishComment() ? new \DateTime() : null);

        $this->om->flush();

        $unitOfWork = $this->om->getUnitOfWork();
        $unitOfWork->computeChangeSets();
        $changeSet = $unitOfWork->getEntityChangeSet($existingComment);

        $this->trackingManager->dispatchCommentUpdateEvent($post, $existingComment, $changeSet);

        return $existingComment;
    }

    /**
     * Publish a comment.
     *
     * @param Blog    $blog
     * @param Post    $post
     * @param Comment $comment
     * @param User    $user
     *
     * @return Comment
     */
    public function publishComment(Blog $blog, Post $post, Comment $existingComment)
    {
        $existingComment->publish();
        $this->om->flush();

        $this->trackingManager->dispatchCommentPublishEvent($post, $existingComment);

        return $existingComment;
    }

    /**
     * Report a comment.
     *
     * @param Blog    $blog
     * @param Post    $post
     * @param Comment $comment
     * @param User    $user
     *
     * @return Comment
     */
    public function reportComment(Blog $blog, Post $post, Comment $existingComment)
    {
        $existingComment->publish();
        $this->om->flush();

        $this->trackingManager->dispatchCommentPublishEvent($post, $existingComment);

        return $existingComment;
    }

    /**
     * unpublish a comment.
     *
     * @param Blog    $blog
     * @param Post    $post
     * @param Comment $comment
     * @param User    $user
     *
     * @return Comment
     */
    public function unpublishComment(Blog $blog, Post $post, Comment $existingComment)
    {
        $existingComment->unpublish();
        $this->om->flush();

        $this->trackingManager->dispatchCommentPublishEvent($post, $existingComment);

        return $existingComment;
    }

    /**
     * Delete a comment.
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     *
     * @return Comment
     */
    public function deleteComment(Blog $blog, Post $post, Comment $existingComment)
    {
        $this->om->remove($existingComment);
        $this->om->flush();
        $this->trackingManager->dispatchCommentDeleteEvent($post, $existingComment);

        return $existingComment->getId();
    }

    /**
     * Update a post.
     *
     * @param Blog $blog
     * @param Post $existingPost
     * @param Post $post
     * @param User $user
     *
     * @return Post
     */
    public function updatePost(Blog $blog, Post $existingPost, Post $post, User $user)
    {
        $existingPost
        ->setTitle($post->getTitle())
        ->setContent($post->getContent());
        if (null !== $post->getPublicationDate()) {
            $existingPost->setPublicationDate($post->getPublicationDate());
        } else {
            $existingPost->setPublicationDate(null);
        }

        $this->om->flush();

        $unitOfWork = $this->om->getUnitOfWork();
        $unitOfWork->computeChangeSets();
        $changeSet = $unitOfWork->getEntityChangeSet($existingPost);

        $this->trackingManager->dispatchPostUpdateEvent($existingPost, $changeSet);

        if ('anon.' !== $user) {
            $this->trackingManager->updateResourceTracking($blog->getResourceNode(), $user, new \DateTime());
        }

        return $existingPost;
    }

    /**
     * Delete a post.
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     *
     * @return Post
     */
    public function deletePost(Blog $blog, Post $post, User $user)
    {
        $this->om->remove($post);
        $this->om->flush();

        $this->trackingManager->dispatchPostDeleteEvent($post);
    }

    /**
     * Update post view count.
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     */
    public function updatePostViewCount($post)
    {
        $post->increaseViewCounter();
        $this->om->persist($post);
        $this->om->flush();
    }

    /**
     * Pin/unpin post.
     *
     * @param Post $post
     */
    public function switchPinState($post)
    {
        $post->setPinned(!$post->isPinned());
        $this->om->persist($post);
        $this->om->flush();
    }

    /**
     * Switch post state.
     *
     * @param Post $post
     * @param User $user
     */
    public function switchPublicationState(Post $post)
    {
        if (!$post->isPublished()) {
            $post->publish();
        } else {
            $post->unpublish();
        }

        $this->om->flush();

        $unitOfWork = $this->om->getUnitOfWork();
        $unitOfWork->computeChangeSets();
        $changeSet = $unitOfWork->getEntityChangeSet($post);

        $this->trackingManager->dispatchPostUpdateEvent($post, $changeSet);

        return $post;
    }

    /**
     * Get posts.
     *
     * @param $blogId
     * @param $filters
     * @param $publishedOnly
     * @param $abstract
     */
    public function getPosts($blogId, $filters, $publishedOnly, $abstract)
    {
        if (!isset($filters['hiddenFilters'])) {
            $filters['hiddenFilters'] = [];
        }
        //filter on current blog
        $filters['hiddenFilters'] = [
            'blog' => $blogId,
        ];

        if ($publishedOnly) {
            $filters['hiddenFilters'] = array_merge($filters['hiddenFilters'], ['published' => 'true']);
        }

        return $this->finder->search('Icap\BlogBundle\Entity\Post', $filters, [
            'abstract' => $abstract,
        ]);
    }

    /**
     * Get comments.
     *
     * @param $blogId
     * @param $postId
     * @param $userId
     * @param $filters
     * @param $publishedOnly
     */
    public function getComments($blogId, $postId, $userId, $filters, $allowedToSeeOnly)
    {
        if (!isset($filters['hiddenFilters'])) {
            $filters['hiddenFilters'] = [];
        }
        //filter on current blog and post
        $filters['hiddenFilters'] = [
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

        return $this->finder->search('Icap\BlogBundle\Entity\Comment', $filters, []);
    }

    /**
     * Get blog post authors.
     *
     * @param Blog $blog
     *
     * @return array
     */
    public function getAuthors($blog)
    {
        return $this->repo->findAuthorsByBlog($blog);
    }

    /**
     * Get blog posts archives.
     *
     * @param Blog $blog
     *
     * @return array
     */
    public function getArchives($blog)
    {
        $postDatas = $this->repo->findArchiveDatasByBlog($blog);
        $archiveDatas = [];

        foreach ($postDatas as $postData) {
            $year = $postData['year'];
            $month = $postData['month'];
            $count = $postData['count'];

            $archiveDatas[$year][] = [
                'month' => $this->translator->trans('month.'.date('F', mktime(0, 0, 0, $month, 10)), [], 'platform'),
                'monthValue' => $month,
                'count' => $count,
            ];
        }

        return $archiveDatas;
    }
}
