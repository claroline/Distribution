<?php

namespace Icap\BlogBundle\Controller\API;

use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\BlogBundle\Manager\BlogTrackingManager;
use Icap\BlogBundle\Manager\CommentManager;
use Icap\BlogBundle\Serializer\CommentSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\Request;

/**
 * @EXT\Route("blog/{blogId}/comments", options={"expose"=true})
 * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"mapping": {"blogId": "uuid"}})
 */
class CommentController
{
    use PermissionCheckerTrait;

    private $postManager;

    /**
     * postController constructor.
     *
     * @DI\InjectParams({
     *     "commentSerializer" = @DI\Inject("claroline.serializer.blog.comment"),
     *     "commentManager"    = @DI\Inject("icap.blog.manager.comment"),
     *     "trackingManager"   = @DI\Inject("icap.blog.manager.tracking")
     * })
     *
     * @param commentSerializer   $commentSerializer
     * @param CommentManager      $commentManager
     * @param BlogTrackingManager $trackingManager
     */
    public function __construct(
        CommentSerializer $commentSerializer,
        CommentManager $commentManager,
        BlogTrackingManager $trackingManager)
    {
        $this->commentSerializer = $commentSerializer;
        $this->commentManager = $commentManager;
        $this->trackingManager = $trackingManager;
    }

    /**
     * Get post comments.
     *
     * @EXT\Route("/{postId}", name="apiv2_blog_comment_list")
     * @EXT\ParamConverter("post", class="IcapBlogBundle:Post", options={"mapping": {"postId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Method("GET")
     *
     * @param Blog $blog
     * @param Post $post
     *
     * @return array
     */
    public function listAction(Request $request, Blog $blog, Post $post, User $user = null)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);

        $userId = null !== $user ? $user->getId() : null;
        //if no edit rights, list only published comments and current user ones
        $canEdit = $this->authorization->isGranted('EDIT', new ObjectCollection([$blog]))
            || $this->authorization->isGranted('MODERATE', new ObjectCollection([$blog]));
        $comments = [];
        if (!$canEdit) {
            $options = [CommentSerializer::INCLUDE_COMMENTS => CommentSerializer::PRELOADED_COMMENTS];
            $parameters = $request->query->all();
            $comments = $this->commentManager->getComments(
                $blog->getId(),
                $post->getId(),
                $userId,
                $parameters,
                !$canEdit)['data'];
        } else {
            $options = [CommentSerializer::INCLUDE_COMMENTS => CommentSerializer::FETCH_COMMENTS];
        }
    }

    /**
     * Get unpublished comments posts.
     *
     * @EXT\Route("/moderation/comments", name="apiv2_blog_comment_unpublished")
     * @EXT\Method("GET")
     *
     * @param Blog $blog
     *
     * @return array
     */
    public function listCommentUnpublishedAction(Request $request, Blog $blog)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        if ($this->checkPermission('MODERATE', $blog->getResourceNode())
            || $this->checkPermission('EDIT', $blog->getResourceNode())) {
            $parameters = $request->query->all();
            $posts = $this->commentManager->getUnpublishedComments(
                $blog->getId(),
                $parameters);

            return new JsonResponse($posts);
        } else {
            throw new AccessDeniedException();
        }
    }
}
