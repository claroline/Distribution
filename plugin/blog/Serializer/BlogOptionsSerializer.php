<?php

namespace Icap\BlogBundle\Serializer;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\BlogOptions;
use Icap\BlogBundle\Manager\BlogManager;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.blog.options")
 * @DI\Tag("claroline.serializer")
 */
class BlogOptionsSerializer
{
    use SerializerTrait;

    private $blogManager;

    /**
     * BlogOptions serializer constructor.
     *
     * @DI\InjectParams({
     *     "blogManager" = @DI\Inject("icap_blog.manager.blog")
     * })
     */
    public function __construct(BlogManager $blogManager)
    {
        $this->blogManager = $blogManager;
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return 'Icap\BlogBundle\Entity\BlogOptions';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/blog/options.json';
    }

    /**
     * @param Blog $blog
     * @param BlogOptions $options
     * @param array       $options
     *
     * @return array - The serialized representation of blog options
     */
    public function serialize(Blog $blog, BlogOptions $blogOptions, array $options = [])
    {
        return [
            'authorizeComment' => $blogOptions->getAuthorizeComment(),
            'authorizeAnonymousComment' => $blogOptions->getAuthorizeAnonymousComment(),
            'postPerPage' => $blogOptions->getPostPerPage(),
            'autoPublishPost' => $blogOptions->getAutoPublishPost(),
            'autoPublishComment' => $blogOptions->getAutoPublishComment(),
            'displayTitle' => $blogOptions->getDisplayTitle(),
            'bannerActivate' => $blogOptions->isBannerActivate(),
            'displayPostViewCounter' => $blogOptions->getDisplayPostViewCounter(),
            'tagCloud' => $blogOptions->getTagCloud() != null ? $blogOptions->getTagCloud() : 0,
            'listWidgetBlog' => $this->serializeWidgetList($blogOptions->getListWidgetBlog()),
            'tagTopMode' => $blogOptions->isTagTopMode(),
            'maxTag' => $blogOptions->getMaxTag(),
            'infos' => $blog->getInfos(),
        ];
    }

    private function serializeWidgetList($mask, array $options = [])
    {
        $panelInfo = $this->blogManager->getPanelInfos();
        $orderPanelsTable = [];
        for ($maskPosition = 0, $entreTableau = 0; $maskPosition < strlen($mask); $maskPosition += 2, $entreTableau++) {
            $i = $mask[$maskPosition];
            $orderPanelsTable[] = [
                'nameTemplate' => $panelInfo[$i],
                'visibility' => (int) $mask[$maskPosition + 1],
                'id' => (int) $mask[$maskPosition],
            ];
        }

        return $orderPanelsTable;
    }

    private function deserializeWidgetList($orderPanelsTable, array $options = [])
    {
        $mask = null;
        foreach ($orderPanelsTable as $row) {
            $mask = $mask.$row['id'].$row['visibility'];
        }

        return $mask;
    }

    /**
     * @param array              $data
     * @param BlogOptions | null $options
     * @param array              $options
     *
     * @return BlogOptions - The deserialized blogOptions entity
     */
    public function deserialize($data, BlogOptions $blogOptions = null, array $options = [])
    {
        if (empty($blogOptions)) {
            $blogOptions = new BlogOptions();
        }
        $this->sipe('id', 'setUuid', $data, $blogOptions);
        $blogOptions->setAuthorizeComment($data['authorizeComment']);
        $blogOptions->setAuthorizeAnonymousComment($data['authorizeAnonymousComment']);
        $blogOptions->setPostPerPage($data['postPerPage']);
        $blogOptions->setAutoPublishPost($data['autoPublishPost']);
        $blogOptions->setAutoPublishComment($data['autoPublishComment']);
        $blogOptions->setDisplayTitle($data['displayTitle']);
        $blogOptions->setBannerActivate($data['bannerActivate']);
        $blogOptions->setDisplayPostViewCounter($data['displayPostViewCounter']);
        $blogOptions->setTagCloud($data['tagCloud']);
        $blogOptions->setListWidgetBlog($this->deserializeWidgetList($data['listWidgetBlog']));
        $blogOptions->setTagTopMode($data['tagTopMode']);
        $blogOptions->setMaxTag($data['maxTag']);

        return $blogOptions;
    }

    private function deserializeBannerBackgroundImageRepeat($data)
    {
        if ($data['bannerBackgroundImageRepeatX'] && $data['bannerBackgroundImageRepeatY']) {
            return BlogOptions::BANNER_REPEAT;
        } elseif ($data['bannerBackgroundImageRepeatX']) {
            return BlogOptions::BANNER_REPEAT_X;
        } elseif ($data['bannerBackgroundImageRepeatY']) {
            return BlogOptions::BANNER_REPEAT_Y;
        }

        return BlogOptions::BANNER_NO_REPEAT;
    }
}
