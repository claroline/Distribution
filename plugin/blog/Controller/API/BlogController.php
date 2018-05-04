<?php

namespace Icap\BlogBundle\Controller\API;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Manager\BlogManager;
use Icap\BlogBundle\Serializer\BlogOptionsSerializer;
use Icap\BlogBundle\Serializer\BlogSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;

/**
 * @EXT\Route("blog/", options={"expose"=true})
 */
class BlogController
{
    use PermissionCheckerTrait;

    /** @var FinderProvider */
    private $finder;
    private $blogSerializer;
    private $blogOptionsSerializer;
    private $blogManager;
    private $router;
    private $configHandler;

    /**
     * BlogController constructor.
     *
     * @DI\InjectParams({
     *     "finder"                = @DI\Inject("claroline.api.finder"),
     *     "blogSerializer"        = @DI\Inject("claroline.serializer.blog"),
     *     "blogOptionsSerializer" = @DI\Inject("claroline.serializer.blog.options"),
     *     "blogManager"           = @DI\Inject("icap_blog.manager.blog"),
     *     "router"                = @DI\Inject("router"),
     *     "configHandler"         = @DI\Inject("claroline.config.platform_config_handler")
     * })
     *
     * @param FinderProvider $finder
     * @param BlogSerializer $blogSerializer
     * @param BlogOptionsSerializer $blogOptionsSerializer
     * @param BlogManager $blogManager
     * @param UrlGeneratorInterface $router
     * @param PlatformConfigurationHandler $configHandler
     */
    public function __construct(
        FinderProvider $finder, 
        BlogSerializer $blogSerializer, 
        BlogOptionsSerializer $blogOptionsSerializer, 
        BlogManager $blogManager, 
        UrlGeneratorInterface $router,
        PlatformConfigurationHandler $configHandler
      )
    {
        $this->finder = $finder;
        $this->blogSerializer = $blogSerializer;
        $this->blogOptionsSerializer = $blogOptionsSerializer;
        $this->blogManager = $blogManager;
        $this->router = $router;
        $this->configHandler = $configHandler;
    }

    /**
     * Get the name of the managed entity.
     *
     * @return string
     */
    public function getName()
    {
        return 'blog';
    }

    /**
     * Get blog options.
     *
     * @EXT\Route("options/{blogId}", name="apiv2_blog_options")
     * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"mapping": {"blogId": "uuid"}})
     * @EXT\Method("GET")
     *
     * @param Blog $blog
     *
     * @return array
     */
    public function getOptionsAction(Request $request, Blog $blog)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);

        return new JsonResponse($this->blogOptionsSerializer->serialize($blog, $blog->getOptions(), $this->blogManager->getPanelInfos()));
    }

    /**
     * Update blog options.
     *
     * @EXT\Route("options/{blogId}", name="apiv2_blog_options")
     * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"mapping": {"blogId": "uuid"}})
     * @EXT\Method("PUT")
     *
     * @param Blog $blog
     *
     * @return array
     */
    public function updateOptionsAction(Request $request, Blog $blog)
    {
        $this->checkPermission('EDIT', $blog->getResourceNode(), [], true);
        $data = json_decode($request->getContent(), true);
        $this->blogManager->updateOptions($blog, $this->blogOptionsSerializer->deserialize($data), $data['infos']);

        // Options updated
        //return new JsonResponse(null, 204);

        return new JsonResponse($this->blogOptionsSerializer->serialize($blog, $blog->getOptions()));
    }
    
    /**
     * @EXT\Route("rss/{blogId}", name="apiv2_blog_rss")
     * @EXT\ParamConverter("blog", class="IcapBlogBundle:Blog", options={"mapping": {"blogId": "uuid"}})
     * @EXT\Method("GET")
     */
    public function rssAction(Blog $blog)
    {
        $baseUrl = $this->router->getContext()->getBaseUrl();
        //$this->router->generate($route, $parameters, $referenceType);
        
        $feed = [
            'title' => $blog->getResourceNode()->getName(),
            'description' => $blog->getInfos(),
            'siteUrl' => $baseUrl.$this->router->generate('icap_blog_open', ['blogId' => $blog->getId()]),
            'feedUrl' => $baseUrl.$this->router->generate('apiv2_blog_rss', ['blogId' => $blog->getId()]),
            'lang' => $this->configHandler->getParameter('locale_language'),
        ];
        
        /** @var \Icap\BlogBundle\Entity\Post[] $posts */
        $posts = $this->getDoctrine()->getRepository('IcapBlogBundle:Post')->findRssDatas($blog);
        
        $items = [];
        foreach ($posts as $post) {
            $items[] = [
                'title' => $post->getTitle(),
                'url' => $baseUrl.$this->generateUrl('icap_blog_post_view', ['blogId' => $blog->getId(), 'postSlug' => $post->getSlug()]),
                'date' => $post->getPublicationDate()->format('d/m/Y h:i:s'),
                'intro' => $post->getContent(),
                'author' => $post->getAuthor()->getFirstName() - $post->getAuthor()->getLastName(),
            ];
        }
        
        return new Response($this->renderView('IcapBlogBundle::rss.html.twig', [
            'feed' => $feed,
            'items' => $items,
        ]), 200, [
            'Content-Type' => 'application/rss+xml',
            'charset' => 'utf-8',
        ]);
    }
    
}
