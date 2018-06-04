<?php

namespace Icap\BlogBundle\Controller;

use Icap\BlogBundle\Entity\Blog;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Sensio\Bundle\FrameworkExtraBundle\Configuration as EXT;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * @EXT\Route("/")
 */
class PostController extends Controller
{
    /**
     * This function is kept for backwards compatibility and redirects old pre-angular URLS to the new react ones.
     *
     * @Route(
     *     "/{blogId}/post/view/{postSlug}",
     *     name="icap_blog_post_view",
     *     requirements={"id" = "\d+"}
     * )
     *
     * @ParamConverter("blog", class="IcapBlogBundle:Blog", options={"id" = "blogId"})
     */
    public function viewAction(Blog $blog, $postSlug)
    {
        return $this->redirect($this->generateUrl('icap_blog_open', ['blogId' => $blog->getId()]).'#/'.$postSlug);
    }

}
