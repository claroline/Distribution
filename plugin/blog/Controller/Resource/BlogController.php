<?php

namespace Icap\BlogBundle\Controller\Resource;

use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Serializer\BlogSerializer;
use Icap\BlogBundle\Serializer\BlogOptionsSerializer;
use Icap\BlogBundle\Manager\BlogManager;
use Icap\BlogBundle\Manager\PostManager;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Claroline\AppBundle\Security\ObjectCollection;

/**
 * @EXT\Route("/", options={"expose"=true})
 */
class BlogController extends Controller
{
    use PermissionCheckerTrait;

    private $blogSerializer;
    private $blogOptionsSerializer;
    private $blogManager;
    private $postManager;
    private $router;
    private $configHandler;
    private $tokenStorage;

    /**
     * BlogController constructor.
     *
     * @DI\InjectParams({
     *     "blogSerializer"        = @DI\Inject("claroline.serializer.blog"),
     *     "blogOptionsSerializer" = @DI\Inject("claroline.serializer.blog.options"),
     *     "blogManager"           = @DI\Inject("icap_blog.manager.blog"),
     *     "postManager"           = @DI\Inject("icap.blog.manager.post"),
     *     "router"                = @DI\Inject("router"),
     *     "configHandler"         = @DI\Inject("claroline.config.platform_config_handler"),
     *     "tokenStorage"          = @DI\Inject("security.token_storage")
     * })
     * 
     * @param BlogSerializer $blogSerializer
     * @param BlogOptionsSerializer $blogOptionsSerializer
     * @param BlogManager $blogManager
     * @param PostManager $postManager
     * @param UrlGeneratorInterface $router
     * @param PlatformConfigurationHandler $configHandler
     * @param TokenStorageInterface $tokenStorage
     * 
     */
    public function __construct(
        BlogSerializer $blogSerializer, 
        BlogOptionsSerializer $blogOptionsSerializer, 
        BlogManager $blogManager, 
        PostManager $postManager, 
        UrlGeneratorInterface $router, 
        PlatformConfigurationHandler $configHandler,
        TokenStorageInterface $tokenStorage
      )
    {
        $this->blogSerializer = $blogSerializer;
        $this->blogOptionsSerializer = $blogOptionsSerializer;
        $this->blogManager = $blogManager;
        $this->postManager = $postManager;
        $this->router = $router;
        $this->configHandler = $configHandler;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * Route parameter is for backwards compatibility and redirects old URLS to the new react ones.
     * @EXT\Route("/{blogId}", name="icap_blog_open")
     * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"id" = "blogId"})
     * @EXT\Template("@IcapBlog/open.html.twig")
     */
    public function openAction(Blog $blog)
    {
        $resourceNode = $blog->getResourceNode();
        $this->checkPermission('OPEN', $resourceNode, [], true);
        $user = $this->tokenStorage->getToken()->getUser();
        $isAnon = 'anon.' === $user;
        $canEdit = $this->authorization->isGranted('EDIT', new ObjectCollection([$blog]));

        return [
            'canEdit' => $canEdit,
            'isAnon' => $isAnon,
            'user' => $user,
            '_resource' => $blog,
            'authors' => $this->postManager->getAuthors($blog),
            'archives' => $this->postManager->getArchives($blog),
        ];
    }
    
    /**
     * @EXT\Route("/rss/{blogId}", name="icap_blog_rss")
     */
    public function rssAction($blogId)
    { 
        //for backwards compatibility with older url using id and not uuid
        $blog = $this->blogManager->getBlogByIdOrUuid($blogId);
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        
        if (is_null($blog)) {
            throw new NotFoundHttpException();
        }
        $feed = [
            'title' => $blog->getResourceNode()->getName(),
            'description' => $blog->getInfos(),
            'siteUrl' => $this->generateUrl('icap_blog_open', ['blogId' => $blog->getId()], UrlGeneratorInterface::ABSOLUTE_URL),
            'feedUrl' => $this->generateUrl('icap_blog_rss', ['blogId' => $blog->getId()], UrlGeneratorInterface::ABSOLUTE_URL),
            'lang' => $this->configHandler->getParameter('locale_language'),
        ];
        
        /** @var \Icap\BlogBundle\Entity\Post[] $posts */
        $posts = $this->postManager->getPosts($blog->getId(), [], true, true);

        $items = [];
        if(isset($posts)) {
            foreach ($posts['data'] as $post) {
                $items[] = [
                    'title' => $post['title'],
                    'url' => $this->generateUrl('apiv2_blog_post_get', ['blogId' => $blog->getId(), 'postId' => $post['slug']], UrlGeneratorInterface::ABSOLUTE_URL),
                    'date' => date("d/m/Y h:i:s", strtotime($post['publicationDate'])),
                    'intro' => $post['content'],
                    'author' => $post['authorName'],
                ];
            }
        }
        
        return new Response($this->renderView('IcapBlogBundle::rss.html.twig', [
            'feed' => $feed,
            'items' => $items,
        ]), 200, [
            'Content-Type' => 'application/rss+xml',
            'charset' => 'utf-8',
        ]);
    }
    
    /**
     * @EXT\Route("/pdf/{blogId}", name="icap_blog_pdf")
     */
    public function viewPdfAction($blogId)
    {
        //for backwards compatibility with older url using id and not uuid
        $blog = $this->blogManager->getBlogByIdOrUuid($blogId);
        $this->checkPermission('OPEN', $blog->getResourceNode(), [], true);
        
        /** @var \Icap\BlogBundle\Repository\PostRepository $postRepository */
       // $postRepository = $this->get('icap.blog.post_repository');
        
        //$posts = $postRepository->findAllPublicByBlog($blog);
        
        /** @var \Icap\BlogBundle\Entity\Post[] $posts */
        $posts = $this->postManager->getPosts($blog->getId(), [], true, false);
        $items = [];
        if(isset($posts)) {
            foreach ($posts['data'] as $post) {
                $items[] = [
                    'title' => $post['title'],
                    'content' => $post['content'],
                    'publicationDate' => $post['publicationDate'] ? $post['publicationDate'] : $post['creationDate'],
                    'author' => $post['authorName'],
                ];
            }
        }
        
        $content = $this->renderView('IcapBlogBundle::view.pdf.twig',
            [
                '_resource' => $blog,
                'posts' => $items,
            ]
            );
        
        return new Response(
            $this->get('knp_snappy.pdf')->getOutputFromHtml(
                $content,
                [
                    'outline' => true,
                    'footer-right' => '[page]/[toPage]',
                    'footer-spacing' => 3,
                    'footer-font-size' => 8,
                ],
                true
                ),
            200,
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="'.$blog->getResourceNode()->getName().'.pdf"',
            ]
            );
    }
    
    /**
     * This function is kept for backwards compatibility and redirects old pre-angular URLS to the new react ones.
     *
     * @EXT\Route(
     *     "/{blogId}/post/view/{postSlug}",
     *     name="icap_blog_post_view"
     * )
     *
     * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"id" = "blogId"})
     */
    public function openPostAction(Blog $blog, $postSlug)
    {
        return $this->redirect($this->generateUrl('icap_blog_open', ['blogId' => $blog->getId()]).'#/'.$postSlug);
    }
}
