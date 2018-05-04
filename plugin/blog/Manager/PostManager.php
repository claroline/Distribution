<?php

namespace Icap\BlogBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Entity\Tag;
use Icap\BlogBundle\Repository\PostRepository;
use Icap\BlogBundle\Manager\BlogTrackingManager;
use JMS\DiExtraBundle\Annotation as DI;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;


/**
 * @DI\Service("icap.blog.manager.post")
 */
class PostManager
{
    private $om;
    private $postManager;
    private $trackingManager;

    /** @var \Icap\BlogBundle\Repository\PostRepository */
    private $repo;

    /**
     * @DI\InjectParams({
     *     "om"              = @DI\Inject("claroline.persistence.object_manager"),
     *     "trackingManager" = @DI\Inject("icap.blog.manager.tracking"),
     *     "repo"            = @DI\Inject("icap.blog.post_repository")
     * })
     */
    public function __construct(ObjectManager $om, BlogTrackingManager $trackingManager, PostRepository $repo)
    {
        $this->om = $om;
        $this->repo = $repo;
        $this->trackingManager = $trackingManager;
    }

    /**
     * @param Blog $blog
     * @param int  $page
     * @param bool $isAdmin
     *
     * @return array
     */
    public function getPostsPaged(Blog $blog, $page = 1, $isAdmin = false)
    {
        $query = $this->repo->getByDateDesc($blog, false, $isAdmin);

        return $this->setPager($query, $page, $blog->getOptions()->getPostPerPage());
    }
    
    /**
     * @param Blog $blog
     * @param string $postId
     *
     * @return post
     */
    public function getPostByIdOrSlug(Blog $blog, $postId){
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
    
    /**
     * Create a post.
     * 
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     */
    public function createPost(Blog $blog, Post $post, User $user)
    {
        //$post = new Post();
        $post
        ->setBlog($blog)
        ->setAuthor($user)
        ->setStatus($blog->isAutoPublishPost() ? Post::STATUS_PUBLISHED : Post::STATUS_UNPUBLISHED)
        ->setCreationDate(new \DateTime())
        ->setModificationDate(new \DateTime());
        
        if ($post->getPublicationDate() !== null) {
            $post->setPublicationDate($post->getPublicationDate());
        }else{
            $post->setPublicationDate(new \DateTime());
        }
        
        // Tags
        //$newTags = $paramFetcher->get('tags');
        //$tagManager = $this->get('icap.blog.manager.tag');
        
        // Add new tags
        /*foreach ($newTags as $newTag) {
            $tag = $tagManager->loadOrCreateTag($newTag['text']);
            $post->addTag($tag);
        }*/
        
        //tracking
        $this->trackingManager->dispatchPostCreateEvent($blog, $post);
        if ($user !== 'anon.') {
            $this->trackingManager->updateResourceTracking($blog->getResourceNode(), $user, new \DateTime());
        }
        
        $this->om->persist($post);
        $this->om->flush();
        
        return $post;
    }
    
    /**
     * Update a post.
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     */
    public function updatePost(Blog $blog, Post $existingPost, Post $post, User $user)
    {
        /*$existingPost = $this->repo->findOneBy([
            'blog' => $blog,
            'uuid' => $post->getUuid(),
        ]);*/
        
        $existingPost
        ->setTitle($post->getTitle())
        ->setContent($post->getContent());
        if ($post->getPublicationDate() !== null) {
            $existingPost->setPublicationDate($post->getPublicationDate());
        } else {
            $existingPost->setPublicationDate(null);
        }
        
        // Tags
       /* $oldTags = $myPost->getTags();
        $newTags = $paramFetcher->get('tags');
        
        // Remove old tags
        foreach ($oldTags as $tag) {
            $existingPost->removeTag($tag);
        }
        
        $tagManager = $this->get('icap.blog.manager.tag');
        
        // Add new tags
        foreach ($newTags as $tag) {
            $myTag = $tagManager->loadOrCreateTag($tag['text']);
            $existingPost->addTag($myTag);
        }*/
        
        //$em->persist($myPost);
        $this->om->flush();
        
        $unitOfWork = $this->om->getUnitOfWork();
        $unitOfWork->computeChangeSets();
        $changeSet = $unitOfWork->getEntityChangeSet($existingPost);
        
        $this->trackingManager->dispatchPostUpdateEvent($existingPost, $changeSet);
        
        if ($user !== 'anon.') {
            $this->trackingManager->updateResourceTracking($blog->getResourceNode(), $user, new \DateTime());
        }
        
        return $existingPost;
    }
    
    /**
     * Update post view count
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     */
    public function updatePostViewCount($post){
        $post->increaseViewCounter();
        $this->om->persist($post);
        $this->om->flush();
    }
    
    /**
     * Switch post state
     *
     * @param Post $post
     * @param User $user
     */
    public function switchPublicationState(Post $post){
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
}
