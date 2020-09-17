<?php

namespace Icap\BlogBundle\Controller\API;

use Claroline\AppBundle\Security\ObjectCollection;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CoreBundle\Validator\Exception\InvalidDataException;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\Comment;
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Manager\BlogTrackingManager;
use Icap\BlogBundle\Manager\CommentManager;
use Icap\BlogBundle\Serializer\CommentSerializer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

/**
 * @Route("blog/{blogId}/comments", options={"expose"=true})
 * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"mapping": {"blogId": "uuid"}})
 */
class CommentController
{
    use PermissionCheckerTrait;

    private $commentSerializer;
    private $commentManager;
    private $trackingManager;

    /**
     * postController constructor.
     *
     * @param commentSerializer             $commentSerializer
     * @param CommentManager                $commentManager
     * @param BlogTrackingManager           $trackingManager
     * @param AuthorizationCheckerInterface $authorization
     */
    public function __construct(
        CommentSerializer $commentSerializer,
        CommentManager $commentManager,
        BlogTrackingManager $trackingManager,
        AuthorizationCheckerInterface $authorization)
    {
        $this->commentSerializer = $commentSerializer;
        $this->commentManager = $commentManager;
        $this->trackingManager = $trackingManager;
        $this->authorization = $authorization;
    }

    /**
     * Get post comments.
     *
     * @Route("/{postId}", name="apiv2_blog_comment_list")
     * @EXT\ParamConverter("post", class="IcapBlogBundle:Post", options={"mapping": {"postId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     * @EXT\Method("GET")
     *
     * @param Request $request
     * @param Blog    $blog
     * @param Post    $post
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function listAction(Request $request, Blog $blog, Post $post, User $user = null)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);

        $userId = null !== $user ? $user->getId() : null;
        //if no edit rights, list only published comments and current user ones
        $canEdit = $this->authorization->isGranted('EDIT', new ObjectCollection([$blog]))
            || $this->authorization->isGranted('MODERATE', new ObjectCollection([$blog]));

        $parameters = $request->query->all();
        $comments = $this->commentManager->getComments(
            $blog->getId(),
            $post->getId(),
            $userId,
            $parameters,
            !$canEdit);

        return new JsonResponse($comments);
    }

    /**
     * Get reported comments posts.
     *
     * @Route("/moderation/reported", name="apiv2_blog_comment_reported")
     * @EXT\Method("GET")
     *
     * @param Request $request
     * @param Blog    $blog
     *
     * @return JsonResponse
     */
    public function listCommentReportedAction(Request $request, Blog $blog)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        if ($this->checkPermission('MODERATE', $blog->getResourceNode())
            || $this->checkPermission('EDIT', $blog->getResourceNode())) {
            $parameters = $request->query->all();
            $posts = $this->commentManager->getReportedComments(
                $blog->getId(),
                $parameters);

            return new JsonResponse($posts);
        } else {
            throw new AccessDeniedException();
        }
    }

    /**
     * Get unpublished comments posts.
     *
     * @Route("/moderation/unpublished", name="apiv2_blog_comment_unpublished")
     * @EXT\Method("GET")
     *
     * @param Request $request
     * @param Blog    $blog
     *
     * @return JsonResponse
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

    /**
     * Get unpublished comments posts.
     *
     * @Route("/moderation/trusted", name="apiv2_blog_comment_trusted")
     * @EXT\Method("GET")
     *
     * @param Blog $blog
     *
     * @return JsonResponse
     */
    public function listTrustedUsersAction(Blog $blog)
    {
        if ($this->checkPermission('MODERATE', $blog->getResourceNode())
            || $this->checkPermission('EDIT', $blog->getResourceNode())) {
            $users = $this->commentManager->getTrustedUsers($blog);

            return new JsonResponse($users);
        } else {
            throw new AccessDeniedException();
        }
    }

    /**
     * Create a post comment.
     *
     * @Route("/{postId}/new", name="apiv2_blog_comment_new")
     * @EXT\Method("POST")
     * @EXT\ParamConverter("post", class="IcapBlogBundle:Post", options={"mapping": {"postId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param Request $request
     * @param Blog    $blog
     * @param Post    $post
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function createCommentAction(Request $request, Blog $blog, Post $post, User $user = null)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        if ($blog->isCommentsAuthorized() && ($blog->isAuthorizeAnonymousComment() || null !== $user)) {
            $data = [];
            $data['message'] = $this->decodeRequest($request)['comment'];
            $forcePublication = $this->authorization->isGranted('EDIT', new ObjectCollection([$blog]))
                || $this->authorization->isGranted('MODERATE', new ObjectCollection([$blog]));
            $comment = $this->commentManager->createComment($blog, $post, $this->commentSerializer->deserialize($data, null, $user), $forcePublication);

            return new JsonResponse($this->commentSerializer->serialize($comment));
        } else {
            throw new AccessDeniedException();
        }
    }

    /**
     * Update post comment.
     *
     * @Route("/{commentId}/update", name="apiv2_blog_comment_update")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("comment", class="IcapBlogBundle:Comment", options={"mapping": {"commentId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=true})
     *
     * @param Request $request
     * @param Blog    $blog
     * @param Comment $comment
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function updateCommentAction(Request $request, Blog $blog, Comment $comment, User $user = null)
    {
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        //original author or admin can edit, anon cant edit
        if ($blog->isCommentsAuthorized() && $this->isLoggedIn($user)) {
            if ($user !== $comment->getAuthor()) {
                $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
            }
            $data = $this->decodeRequest($request)['comment'];
            $comment = $this->commentManager->updateComment($blog, $comment, $data);

            return new JsonResponse($this->commentSerializer->serialize($comment));
        } else {
            throw new AccessDeniedException();
        }
    }

    /**
     * Publish post comment.
     *
     * @Route("/{commentId}/publish", name="apiv2_blog_comment_publish")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("comment", class="IcapBlogBundle:Comment", options={"mapping": {"commentId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog    $blog
     * @param Comment $comment
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function publishCommentAction(Blog $blog, Comment $comment, User $user)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
        $comment = $this->commentManager->publishComment($blog, $comment);

        return new JsonResponse($this->commentSerializer->serialize($comment));
    }

    /**
     * Unpublish post comment.
     *
     * @Route("/{commentId}/unpublish", name="apiv2_blog_comment_unpublish")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("comment", class="IcapBlogBundle:Comment", options={"mapping": {"commentId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog    $blog
     * @param Comment $comment
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function unpublishCommentAction(Blog $blog, Comment $comment, User $user)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
        $comment = $this->commentManager->unpublishComment($blog, $comment);

        return new JsonResponse($this->commentSerializer->serialize($comment));
    }

    /**
     * Report post comment.
     *
     * @Route("/{commentId}/report", name="apiv2_blog_comment_report")
     * @EXT\Method("PUT")
     * @EXT\ParamConverter("comment", class="IcapBlogBundle:Comment", options={"mapping": {"commentId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog    $blog
     * @param Comment $comment
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function reportCommentAction(Blog $blog, Comment $comment, User $user)
    {
        $comment = $this->commentManager->reportComment($blog, $comment);

        return new JsonResponse($this->commentSerializer->serialize($comment));
    }

    /**
     * Delete post comment.
     *
     * @Route("/{commentId}/delete", name="apiv2_blog_comment_delete")
     * @EXT\Method("DELETE")
     * @EXT\ParamConverter("comment", class="IcapBlogBundle:Comment", options={"mapping": {"commentId": "uuid"}})
     * @EXT\ParamConverter("user", converter="current_user", options={"allowAnonymous"=false})
     *
     * @param Blog    $blog
     * @param Comment $comment
     * @param User    $user
     *
     * @return JsonResponse
     */
    public function deleteCommentAction(Blog $blog, Comment $comment, User $user)
    {
        //original author or admin can edit, anon cant edit
        if ($blog->isCommentsAuthorized() && $this->isLoggedIn($user)) {
            if ($user === $comment->getAuthor()
                || $this->checkPermission('EDIT', $blog->getResourceNode())
                || $this->checkPermission('MODERATE', $blog->getResourceNode())) {
                $commentId = $this->commentManager->deleteComment($blog, $comment);

                return new JsonResponse($commentId);
            } else {
                throw new AccessDeniedException();
            }
        } else {
            throw new AccessDeniedException();
        }
    }

    /**
     * Is the user logged in or not ?
     *
     * @param User $user
     *
     * @return bool
     */
    private function isLoggedIn(User $user)
    {
        return is_string($user) ? false : true;
    }

    /**
     * Gets and Deserializes JSON data from Request.
     *
     * @param Request $request
     *
     * @return mixed $data
     *
     * @throws InvalidDataException
     */
    protected function decodeRequest(Request $request)
    {
        $decodedRequest = json_decode($request->getContent(), true);

        if (null === $decodedRequest) {
            throw new InvalidDataException('Invalid request content sent.', []);
        }

        return $decodedRequest;
    }
}
