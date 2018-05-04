<?php

namespace Icap\BlogBundle\Controller\API;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CoreBundle\Entity\User;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\Post;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Icap\BlogBundle\Serializer\PostSerializer;
use Icap\BlogBundle\Manager\PostManager;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Icap\BlogBundle\Manager\BlogTrackingManager;
use Claroline\AppBundle\Security\ObjectCollection;

/**
 * @EXT\Route("blog/{blogId}/posts", options={"expose"=true})
 * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"mapping": {"blogId": "uuid"}})
 */
class PostController
{
    use PermissionCheckerTrait;

    /** @var FinderProvider */
    private $finder;
    private $postSerializer;
    private $postManager;
    private $trackingManager;
    private $logThreshold;

    /**
     * postController constructor.
     *
     * @DI\InjectParams({
     *     "finder"          = @DI\Inject("claroline.api.finder"),
     *     "postSerializer"  = @DI\Inject("claroline.serializer.blog.post"),
     *     "postManager"     = @DI\Inject("icap.blog.manager.post"),
     *     "trackingManager" = @DI\Inject("icap.blog.manager.tracking"),
     *     "logThreshold"    = @DI\Inject("%non_repeatable_log_time_in_seconds%")
     * })
     *
     * @param FinderProvider $finder
     */
    public function __construct(FinderProvider $finder, PostSerializer $postSerializer, PostManager $postManager, BlogTrackingManager $trackingManager, $logThreshold)
    {
        $this->finder = $finder;
        $this->postSerializer = $postSerializer;
        $this->postManager = $postManager;
        $this->trackingManager = $trackingManager;
        $this->logThreshold = $logThreshold;
    }

    /**
     * Get the name of the managed entity.
     *
     * @return string
     */
    public function getName()
    {
        return 'post';
    }

    /**
     * Get blog posts.
     *
     * @EXT\Route("", name="apiv2_blog_post_list")
     * @EXT\Method("GET")
     *
     * @param Blog $blog
     *
     * @return array
     */
    public function listAction(Request $request, Blog $blog)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        
        $parameters = $request->query->all();
        if (!isset($parameters['hiddenFilters'])) {
            $parameters['hiddenFilters'] = [];
        }

        //if no edit rights, list only published posts
        $posts = $this->getPosts(
            $blog->getId(), 
            $parameters, 
            !$this->authorization->isGranted('EDIT', new ObjectCollection([$blog])), 
            true);

        return new JsonResponse($posts);
    }
    
    public function getPosts($blogId, $filters, $publishedOnly, $abstract){
        //filter on current blog
        $filters['hiddenFilters'] = [
            'blog' => $blogId,
        ];
        
        if($publishedOnly){
            $filters['hiddenFilters'] = array_merge($filters['hiddenFilters'], array('published' => 'true'));
        }
        return $this->finder->search('Icap\BlogBundle\Entity\Post', $filters, [
           'abstract' => $abstract,
        ]);
    }

    /**
     * Get blog post.
     *
     * @EXT\Route("/{postId}", name="apiv2_blog_post_get")
     * @EXT\Method("GET")
     *
     * @param Blog $blog
     * @param Post $post
     *
     * @return array
     */
    public function getAction(Request $request, Blog $blog, $postId)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        
        $post = $this->postManager->getPostByIdOrSlug($blog, $postId);
        
        /*$parameters = $request->query->all();
        if (!isset($parameters['hiddenFilters'])) {
            $parameters['hiddenFilters'] = [];
        }
        //filter on current blog and post
        $parameters['hiddenFilters'] = [
            'blog' => $blog->getId(),
        ];*/

        //by id
       /* if (preg_match('/^\d+$/', $postId)) {
            $parameters['hiddenFilters']['id'] = $postId;
        //by slug
        } else {
            $parameters['hiddenFilters']['slug'] = $postId;
        }*/
        
        //$posts = $this->finder->search('Icap\BlogBundle\Entity\Post', $parameters);
       // $post = $posts['data'][0];
        if (is_null($post)) {
            throw new NotFoundHttpException();
        }
        
        $this->trackingManager->dispatchPostReadEvent($post);
        
        $session = $request->getSession();
        $sessionViewCounterKey = 'blog_post_view_counter_'.$post->getId();
        $now = time();
        
        if ($now >= ($session->get($sessionViewCounterKey) + $this->logThreshold)) {
            $session->set($sessionViewCounterKey, $now);
            $this->postManager->updatePostViewCount($post);
        }

        return new JsonResponse($this->postSerializer->serialize($post));
    }
    
    /**
     * Create blog post.
     *
     * @EXT\Route("/new", name="apiv2_blog_post_new")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog $blog
     * @param User $user
     *
     * @return array
     */
    public function createPostAction(Request $request, Blog $blog, User $user)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
        $data = json_decode($request->getContent(), true);
        $post = $this->postManager->createPost($blog, $this->postSerializer->deserialize($data), $user);
        
        return new JsonResponse($this->postSerializer->serialize($post));
    }
    
    /**
     * Update blog post.
     *
     * @EXT\Route("/update/{postId}", name="apiv2_blog_post_update")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("post", class="IcapBlogBundle:Post", options={"mapping": {"postId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     *
     * @return array
     */
    public function updatePostAction(Request $request, Blog $blog, Post $post, User $user)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
        $data = json_decode($request->getContent(), true);
        $post = $this->postManager->updatePost($blog, $post, $this->postSerializer->deserialize($data), $user);
        
        return new JsonResponse($this->postSerializer->serialize($post));
    }
    
    /**
     * Switch post publication state.
     *
     * @EXT\Route("/publish/{postId}", name="apiv2_blog_post_publish")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("post", class="IcapBlogBundle:Post", options={"mapping": {"postId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog $blog
     * @param Post $post
     * @param User $user
     *
     * @return array
     */
    public function publishPostAction(Request $request, Blog $blog, Post $post, User $user)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
        
        $this->postManager->switchPublicationState($post);
        
        /*$myPost = $this->get('icap.blog.post_repository')->findOneBy([
            'blog' => $blog,
            'id' => $post,
        ]);*/
        
        //$post = $this->postManager->getPostByIdOrSlug($blog, $postId);
        
       /* if (is_null($myPost)) {
            throw new NotFoundHttpException();
        }
        
        if ($paramFetcher->get('is_published') === true) {
            $myPost->publish();
        } else {
            $myPost->unpublish();
        }
        
        $em = $this->getDoctrine()->getManager();
        $em->persist($myPost);
        $em->flush();
        
        $unitOfWork = $em->getUnitOfWork();
        $unitOfWork->computeChangeSets();
        $changeSet = $unitOfWork->getEntityChangeSet($myPost);
        
        $this->dispatchPostUpdateEvent($myPost, $changeSet);
        
        return $myPost;
        
        
        $post = $this->postManager->updatePost($blog, $this->postSerializer->deserialize($data), $user);
        */
        return new JsonResponse($this->postSerializer->serialize($post));
    }
    
}
