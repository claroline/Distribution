<?php

namespace Icap\BlogBundle\Listener;

use Claroline\CoreBundle\Entity\Resource\AbstractResourceEvaluation;
use Claroline\CoreBundle\Event\Resource\CopyResourceEvent;
use Claroline\CoreBundle\Event\CreateFormResourceEvent;
use Claroline\CoreBundle\Event\CreateResourceEvent;
use Claroline\CoreBundle\Event\CustomActionResourceEvent;
use Claroline\CoreBundle\Event\Resource\DeleteResourceEvent;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Event\Resource\OpenResourceEvent;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\Comment;
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Form\BlogType;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Symfony\Component\Form\FormFactory;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @DI\Service
 */
class BlogListener
{
    use ContainerAwareTrait;
    /** @var FormFactory */
    private $formFactory;
    /** @var HttpKernelInterface */
    private $httpKernel;
    /** @var Request */
    private $request;
    /** @var TwigEngine */
    private $templating;
    /** @var ContainerInterface */
    private $container;

    /**
     * BlogListener constructor.
     *
     * @DI\InjectParams({
     *     "formFactory"           = @DI\Inject("form.factory"),
     *     "httpKernel"            = @DI\Inject("http_kernel"),
     *     "requestStack"          = @DI\Inject("request_stack"),
     *     "templating"            = @DI\Inject("templating"),
     *     "container"             = @DI\Inject("service_container")
     * })
     *
     * @param FormFactory         $formFactory
     * @param HttpKernelInterface $httpKernel
     * @param RequestStack        $requestStack
     * @param TwigEngine          $templating
     * @param ContainerInterface  $container
     */
    public function __construct(
        FormFactory $formFactory,
        HttpKernelInterface $httpKernel,
        RequestStack $requestStack,
        TwigEngine $templating,
        ContainerInterface $container
    ) {
        $this->formFactory = $formFactory;
        $this->httpKernel = $httpKernel;
        $this->request = $requestStack->getCurrentRequest();
        $this->templating = $templating;
        $this->container = $container;
    }

    /**
     * @DI\Observe("create_form_icap_blog")
     *      
     * @param CreateFormResourceEvent $event
     */
    public function onCreateForm(CreateFormResourceEvent $event)
    {
        $form = $this->container->get('form.factory')->create(new BlogType(), new Blog());
        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:resource:create_form.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => 'icap_blog',
            ]
        );
        $event->setResponseContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("create_icap_blog")
     * 
     * @param CreateResourceEvent $event
     */
    public function onCreate(CreateResourceEvent $event)
    {
        $request = $this->container->get('request_stack')->getMasterRequest();
        $form = $this->container->get('form.factory')->create(new BlogType(), new Blog());
        $form->bind($request);

        if ($form->isValid()) {
            $event->setResources([$form->getData()]);
            $event->stopPropagation();

            return;
        }

        $content = $this->container->get('templating')->render(
            'ClarolineCoreBundle:resource:create_form.html.twig',
            [
                'form' => $form->createView(),
                'resourceType' => 'icap_blog',
            ]
        );
        $event->setErrorFormContent($content);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("open_icap_blog")
     *
     * @param OpenResourceEvent $event
     */
    public function onOpen(OpenResourceEvent $event)
    {
        /*$route = $this->container
            ->get('router')
            ->generate(
                'icap_blog_view',
                ['blogId' => $event->getResource()->getId()]
            );
        $event->setResponse(new RedirectResponse($route));
        $event->stopPropagation();*/

        $params = [];
        $params['_controller'] = 'IcapBlogBundle:Resource\Blog:open';
        $params['blogId'] = $event->getResource()->getId();
        $subRequest = $this->request->duplicate([], null, $params);
        $response = $this->httpKernel->handle($subRequest, HttpKernelInterface::SUB_REQUEST);
        $event->setResponse($response);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("delete_icap_blog")
     * 
     * @param DeleteResourceEvent $event
     */
    public function onDelete(DeleteResourceEvent $event)
    {
        $blog = $event->getResource();
        $options = $blog->getOptions();
        @unlink($this->container->getParameter('icap.blog.banner_directory').DIRECTORY_SEPARATOR.$options->getBannerBackgroundImage());

        $widgetInstanceRepo = $this->container->get('doctrine.orm.entity_manager')->getRepository('Claroline\CoreBundle\Entity\Widget\WidgetInstance');
        $widgetBlogRepo = $this->container->get('icap.blog.widgetblog_repository');
        $widgetTagListRepo = $this->container->get('icap.blog.widgettaglistblog_repository');

        $blogWidgets = $widgetBlogRepo->findByResourceNode($blog->getResourceNode());
        $tagListWidgets = $widgetTagListRepo->findByResourceNode($blog->getResourceNode());

        $entityManager = $this->container->get('claroline.persistence.object_manager');

        // Remove blog widgets
        foreach ($blogWidgets as $blogWidget) {
            $entityManager->remove($blogWidget);
            $widgetBlogInstance = $widgetInstanceRepo->findOneById($blogWidget->getWidgetInstance()->getId());
            $entityManager->remove($widgetBlogInstance);
        }

        // Remove tag list blog widgets
        foreach ($tagListWidgets as $tagListWidget) {
            $entityManager->remove($tagListWidget);
            $widgetInstance = $widgetInstanceRepo->findOneById($tagListWidget->getWidgetInstance()->getId());
            $entityManager->remove($widgetInstance);
        }

        $entityManager->flush();

        $event->stopPropagation();
    }

    /**
     * @DI\Observe("copy_icap_blog")
     *
     * @param CopyResourceEvent $event
     */
    public function onCopy(CopyResourceEvent $event)
    {
        $entityManager = $this->container->get('claroline.persistence.object_manager');
        /** @var \Icap\BlogBundle\Entity\Blog $blog */
        $blog = $event->getResource();

        $newBlog = new Blog();

        $entityManager->persist($newBlog);
        $entityManager->flush($newBlog);

        foreach ($blog->getPosts() as $post) {
            /** @var \Icap\BlogBundle\Entity\Post $newPost */
            $newPost = new Post();
            $newPost
                ->setTitle($post->getTitle())
                ->setContent($post->getContent())
                ->setAuthor($post->getAuthor())
                ->setStatus($post->getStatus())
                ->setBlog($newBlog)
            ;

            $newTags = $post->getTags();
            foreach ($newTags as $tag) {
                $newPost->addTag($tag);
            }

            $entityManager->persist($newPost);
            $entityManager->flush($newPost);

            foreach ($post->getComments() as $comment) {
                /** @var \Icap\BlogBundle\Entity\Comment $newComment */
                $newComment = new Comment();
                $newComment
                    ->setAuthor($comment->getAuthor())
                    ->setMessage($comment->getMessage())
                    ->setPost($newPost)
                ;
            }
        }

        $entityManager->persist($newBlog);

        $event->setCopy($newBlog);
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("configure_blog_icap_blog")
     * 
     * @param CustomActionResourceEvent $event
     */
    public function onConfigure(CustomActionResourceEvent $event)
    {
        $route = $this->container
            ->get('router')
            ->generate(
                'icap_blog_configure',
                ['blogId' => $event->getResource()->getId()]
            );
        $event->setResponse(new RedirectResponse($route));
        $event->stopPropagation();
    }

    /**
     * @DI\Observe("generate_resource_user_evaluation_icap_blog")
     * 
     * @param GenericDataEvent $event
     */
    public function onGenerateResourceTracking(GenericDataEvent $event)
    {
        $om = $this->container->get('claroline.persistence.object_manager');
        $resourceEvalManager = $this->container->get('claroline.manager.resource_evaluation_manager');
        $data = $event->getData();
        $node = $data['resourceNode'];
        $user = $data['user'];
        $startDate = $data['startDate'];

        $logs = $resourceEvalManager->getLogsForResourceTracking(
            $node,
            $user,
            ['resource-read', 'resource-icap_blog-post_create', 'resource-icap_blog-post_update', 'resource-icap_blog-comment_create'],
            $startDate
        );
        $nbLogs = count($logs);

        if ($nbLogs > 0) {
            $om->startFlushSuite();
            $tracking = $resourceEvalManager->getResourceUserEvaluation($node, $user);
            $tracking->setDate($logs[0]->getDateLog());
            $status = AbstractResourceEvaluation::STATUS_UNKNOWN;
            $nbAttempts = 0;
            $nbOpenings = 0;

            foreach ($logs as $log) {
                switch ($log->getAction()) {
                    case 'resource-read':
                        ++$nbOpenings;

                        if (AbstractResourceEvaluation::STATUS_UNKNOWN === $status) {
                            $status = AbstractResourceEvaluation::STATUS_OPENED;
                        }
                        break;
                    case 'resource-icap_blog-post_create':
                    case 'resource-icap_blog-post_update':
                    case 'resource-icap_blog-comment_create':
                        ++$nbAttempts;
                        $status = AbstractResourceEvaluation::STATUS_PARTICIPATED;
                        break;
                }
            }
            $tracking->setStatus($status);
            $tracking->setNbAttempts($nbAttempts);
            $tracking->setNbOpenings($nbOpenings);
            $om->persist($tracking);
            $om->endFlushSuite();
        }
        $event->stopPropagation();
    }
}
