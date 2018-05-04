<?php

namespace Icap\BlogBundle\Controller\Resource;

use Claroline\CoreBundle\Security\PermissionCheckerTrait;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Serializer\BlogOptionsSerializer;
use JMS\DiExtraBundle\Annotation as DI;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @EXT\Route("/", options={"expose"=true})
 */
class BlogController extends Controller
{
    use PermissionCheckerTrait;

    private $blogSerializer;

    /**
     * BlogController constructor.
     *
     * @DI\InjectParams({
     *     "blogOptionsSerializer"  = @DI\Inject("claroline.serializer.blog.options")
     * })
     */
    public function __construct(BlogOptionsSerializer $blogOptionsSerializer)
    {
        $this->blogOptionsSerializer = $blogOptionsSerializer;
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

        return [
            '_resource' => $blog,
            'options' => $this->blogOptionsSerializer->serialize($blog, $blog->getOptions()),
        ];
    }
}
