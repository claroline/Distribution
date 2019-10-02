<?php

namespace Icap\BlogBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Event\GenericDataEvent;
use Claroline\CoreBundle\Library\Utilities\FileUtilities;
use Doctrine\Common\Collections\ArrayCollection;
use Icap\BlogBundle\Entity\Blog;
use Icap\BlogBundle\Entity\BlogOptions;
use Icap\BlogBundle\Entity\Comment;
use Icap\BlogBundle\Entity\Post;
use Icap\BlogBundle\Entity\Tag;
use Icap\BlogBundle\Repository\BlogRepository;
use Icap\BlogBundle\Repository\MemberRepository;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\File\File;

class BlogManager
{
    private $objectManager;
    private $uploadDir;
    private $repo;
    private $memberRepo;
    private $eventDispatcher;
    private $postManager;
    private $fileUtils;

    public function __construct(
        ObjectManager $objectManager,
        $uploadDir,
        BlogRepository $repo,
        MemberRepository $memberRepo,
        EventDispatcherInterface $eventDispatcher,
        PostManager $postManager,
        FileUtilities $fileUtils)
    {
        $this->objectManager = $objectManager;
        $this->uploadDir = $uploadDir;
        $this->repo = $repo;
        $this->memberRepo = $memberRepo;
        $this->eventDispatcher = $eventDispatcher;
        $this->postManager = $postManager;
        $this->fileUtils = $fileUtils;
    }

    /**
     * @param Workspace $workspace
     * @param array     $files
     * @param Blog      $object
     *
     * @return array
     */
    public function exportBlog(Workspace $workspace, array &$files, Blog $object)
    {
        $data = [];

        $infosUid = uniqid().'.txt';
        $infosTemporaryPath = sys_get_temp_dir().DIRECTORY_SEPARATOR.$infosUid;
        file_put_contents($infosTemporaryPath, $object->getInfos());
        $files[$infosUid] = $infosTemporaryPath;

        $data['infos_path'] = $infosUid;
        $data['options'] = [
            'authorize_comment' => $object->getOptions()->getAuthorizeComment(),
            'authorize_anonymous_comment' => $object->getOptions()->getAuthorizeAnonymousComment(),
            'post_per_page' => $object->getOptions()->getPostPerPage(),
            'auto_publish_post' => $object->getOptions()->getAutoPublishPost(),
            'auto_publish_comment' => $object->getOptions()->getAutoPublishComment(),
            'display_title' => $object->getOptions()->getDisplayTitle(),
            'banner_activate' => $object->getOptions()->isBannerActivate(),
            'display_post_view_counter' => $object->getOptions()->getDisplayPostViewCounter(),
            'banner_background_color' => $object->getOptions()->getBannerBackgroundColor(),
            'banner_height' => $object->getOptions()->getBannerHeight(),
            'banner_background_image' => $object->getOptions()->getBannerBackgroundImage(),
            'banner_background_image_position' => $object->getOptions()->getBannerBackgroundImagePosition(),
            'banner_background_image_repeat' => $object->getOptions()->getBannerBackgroundImageRepeat(),
            'tag_cloud' => (null === $object->getOptions()->getTagCloud()) ? 0 : $object->getOptions()->getTagCloud(),
            'comment_moderation_mode' => $object->getOptions()->getCommentModerationMode(),
            'display_full_posts' => $object->getOptions()->getDisplayFullPosts(),
        ];

        $data['posts'] = [];

        foreach ($object->getPosts() as $post) {
            $postUid = uniqid().'.txt';
            $postTemporaryPath = sys_get_temp_dir().DIRECTORY_SEPARATOR.$postUid;
            file_put_contents($postTemporaryPath, $post->getContent());
            $files[$postUid] = $postTemporaryPath;

            $event = new GenericDataEvent([
                'class' => 'Icap\BlogBundle\Entity\Post',
                'ids' => [$post->getUuid()],
            ]);
            $this->eventDispatcher->dispatch('claroline_retrieve_used_tags_by_class_and_ids', $event);
            $tags = $event->getResponse();

            $comments = [];
            foreach ($post->getComments() as $comment) {
                $commentUid = uniqid().'.txt';
                $commentTemporaryPath = sys_get_temp_dir().DIRECTORY_SEPARATOR.$commentUid;
                file_put_contents($commentTemporaryPath, $comment->getMessage());
                $files[$commentUid] = $commentTemporaryPath;

                $comments[] = [
                    'message' => $commentUid,
                    'author' => $comment->getAuthor()->getEmail(),
                    'reported' => $comment->getReported(),
                    'creation_date' => $comment->getCreationDate()->format('Y-m-d H:i:s'),
                    'update_date' => (null !== $comment->getUpdateDate()) ? $comment->getUpdateDate()->format('Y-m-d H:i:s') : null,
                    'publication_date' => (null !== $comment->getPublicationDate()) ? $comment->getPublicationDate()->format('Y-m-d H:i:s') : null,
                    'status' => $comment->getStatus(),
                ];
            }

            $postArray = [
                'title' => $post->getTitle(),
                'content' => $postUid,
                'author' => $post->getAuthor()->getEmail(),
                'status' => $post->getStatus(),
                'pinned' => $post->isPinned(),
                'creation_date' => $post->getCreationDate()->format('Y-m-d H:i:s'),
                'modification_date' => (null !== $post->getModificationDate()) ? $post->getModificationDate()->format('Y-m-d H:i:s') : null,
                'publication_date' => (null !== $post->getPublicationDate()) ? $post->getPublicationDate()->format('Y-m-d H:i:s') : null,
                'tags' => $tags,
                'comments' => $comments,
            ];

            $data['posts'][] = $postArray;
        }

        return $data;
    }

    public function createUploadFolder($uploadFolderPath)
    {
        if (!file_exists($uploadFolderPath)) {
            mkdir($uploadFolderPath, 0777, true);
        }
    }

    /**
     * @param array  $data
     * @param string $rootPath
     * @param User   $owner
     *
     * @return Blog
     */
    public function importBlog(array $data, $rootPath, User $owner)
    {
        $blogDatas = $data['data'];
        $optionsData = $blogDatas['options'];

        $blogOptions = new BlogOptions();
        $blogOptions
            ->setAuthorizeComment($optionsData['authorize_comment'])
            ->setAuthorizeAnonymousComment($optionsData['authorize_anonymous_comment'])
            ->setPostPerPage($optionsData['post_per_page'])
            ->setAutoPublishPost($optionsData['auto_publish_post'])
            ->setAutoPublishComment($optionsData['auto_publish_comment'])
            ->setDisplayTitle($optionsData['display_title'])
            ->setBannerActivate($optionsData['banner_activate'])
            ->setDisplayPostViewCounter($optionsData['display_post_view_counter'])
            ->setBannerBackgroundColor($optionsData['banner_background_color'])
            ->setBannerHeight($optionsData['banner_height'])
            ->setBannerBackgroundImagePosition($optionsData['banner_background_image_position'])
            ->setBannerBackgroundImageRepeat($optionsData['banner_background_image_repeat'])
            ->setTagCloud($optionsData['tag_cloud']);

        if (isset($optionsData['display_full_posts'])) {
            $blogOptions->setDisplayFullPosts($optionsData['display_full_posts']);
        } else {
            $blogOptions->setDisplayFullPosts(false);
        }

        if (isset($optionsData['comment_moderation_mode'])) {
            $blogOptions->setCommentModerationMode($optionsData['comment_moderation_mode']);
        } else {
            $blogOptions->setCommentModerationMode(BlogOptions::COMMENT_MODERATION_ALL);
        }

        $blog = new Blog();
        if (isset($blogDatas['infos_path']) && null !== $blogDatas['infos_path']) {
            $infos = file_get_contents(
                $rootPath.DIRECTORY_SEPARATOR.$blogDatas['infos_path']
            );
            $blog->setInfos($infos);
        }
        $blog->setOptions($blogOptions);
        $this->objectManager->persist($blog);
        //flush, otherwise we dont have the website ID needed for building uploadPath for banner
        //$this->objectManager->forceFlush();

        //Copy banner bg image to web folder, old system, for compatibility
        if (isset($optionsData['banner_background_image']) && null !== $optionsData['banner_background_image'] && !filter_var($optionsData['banner_background_image'], FILTER_VALIDATE_URL)) {
            $bannerPath = $rootPath.DIRECTORY_SEPARATOR.$optionsData['banner_background_image'];
            if (file_exists($bannerPath)) {
                $publicFile = $this->fileUtils->createFile(new File($bannerPath));
                $blog->getResourceNode()->setPoster($publicFile->getUrl());
            }
        }

        $postsDatas = $blogDatas['posts'];
        $posts = new ArrayCollection();

        foreach ($postsDatas as $postsData) {
            $tagsDatas = $postsData['tags'];
            $tags = [];
            foreach ($tagsDatas as $tagsData) {
                $tags[] = $tagsData['name'];
            }
            $post = new Post();
            //insert tags
            $event = new GenericDataEvent([
                'tags' => array_values($tags),
                'data' => [
                    [
                        'class' => 'Icap\BlogBundle\Entity\Post',
                        'id' => $post->getUuid(),
                        'name' => $post->getTitle(),
                    ],
                ],
                'replace' => true,
            ]);
            $this->eventDispatcher->dispatch('claroline_tag_multiple_data', $event);

            $commentsDatas = $postsData['comments'];
            $comments = new ArrayCollection();
            foreach ($commentsDatas as $commentsData) {
                $comment = new Comment();
                $commentMessage = file_get_contents($rootPath.DIRECTORY_SEPARATOR.$commentsData['message']);
                $comment
                    ->setMessage($commentMessage)
                    ->setAuthor($this->retrieveUser($commentsData['author'], $owner))
                    ->setCreationDate(new \DateTime($postsData['creation_date']))
                    ->setUpdateDate(new \DateTime($postsData['modification_date']))
                    ->setPublicationDate(new \DateTime($postsData['publication_date']))
                    ->setStatus($commentsData['status'])
                ;
                if (isset($commentsData['reported'])) {
                    $comment->setReported($commentsData['reported']);
                }

                $this->objectManager->persist($comment);
                $comments->add($comment);
            }

            $postContent = file_get_contents($rootPath.DIRECTORY_SEPARATOR.$postsData['content']);

            $post
                ->setTitle($postsData['title'])
                ->setContent($postContent)
                ->setAuthor($this->retrieveUser($postsData['author'], $owner))
                ->setCreationDate(new \DateTime($postsData['creation_date']))
                ->setModificationDate(new \DateTime($postsData['modification_date']))
                ->setPublicationDate(new \DateTime($postsData['publication_date']))
                ->setComments($comments)
                ->setStatus($postsData['status'])
            ;

            if (isset($postsData['pinned'])) {
                $post->setPinned($postsData['pinned']);
            }

            $posts->add($post);
        }

        $blog->setPosts($posts);

        return $blog;
    }

    /**
     * @param string $email
     * @param User   $owner
     *
     * @return User|null
     */
    protected function retrieveUser($email, User $owner)
    {
        $user = $this->objectManager->getRepository('ClarolineCoreBundle:User')->findOneByEmail($email);

        if (null === $user) {
            $user = $owner;
        }

        return $user;
    }

    /**
     * This method is used by the workspace import function.
     *
     * @param string $name
     *
     * @return Tag
     */
    protected function retrieveTag($name)
    {
        $tag = $this->objectManager->getRepository('IcapBlogBundle:Tag')->findOneByName($name);

        if (!$tag) {
            //let's look if it's scheduled for an Insert...
            $tag = $this->getTagFromIdentityMapOrScheduledForInsert($name);

            if (!$tag) {
                $tag = new Tag();
                $tag->setName($name);
                $this->objectManager->persist($tag);
            }
        }

        return $tag;
    }

    private function getTagFromIdentityMapOrScheduledForInsert($name)
    {
        $res = $this->getTagFromIdentityMap($name);

        if ($res) {
            return $res;
        }

        return $this->getTagScheduledForInsert($name);
    }

    private function getTagScheduledForInsert($name)
    {
        $scheduledForInsert = $this->objectManager->getUnitOfWork()->getScheduledEntityInsertions();

        foreach ($scheduledForInsert as $entity) {
            if ('Icap\BlogBundle\Entity\Tag' === get_class($entity)) {
                if (strtoupper(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $entity->getName())) === strtoupper(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name))) {
                    return $entity;
                }
            }
        }

        return;
    }

    private function getTagFromIdentityMap($name)
    {
        $map = $this->objectManager->getUnitOfWork()->getIdentityMap();

        if (!array_key_exists('Icap\BlogBundle\Entity\Tag', $map)) {
            return;
        }

        //so it was in the identityMap hey !
        foreach ($map['Icap\BlogBundle\Entity\Tag'] as $tag) {
            if (strtoupper(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $tag->getName())) === strtoupper(iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name))) {
                return $tag;
            }
        }

        return;
    }

    public function getPanelInfos()
    {
        return [
            'infobar',
            'rss',
            'tagcloud',
            'redactor',
            'calendar',
            'archives',
        ];
    }

    public function getOldPanelInfos()
    {
        return [
            'search',
            'infobar',
            'rss',
            'tagcloud',
            'redactor',
            'calendar',
            'archives',
        ];
    }

    public function updateOptions(Blog $blog, BlogOptions $options, $infos)
    {
        $currentOptions = $blog->getOptions();
        $currentOptions->setAuthorizeComment($options->getAuthorizeComment());
        $currentOptions->setAuthorizeAnonymousComment($options->getAuthorizeAnonymousComment());
        $currentOptions->setPostPerPage($options->getPostPerPage());
        $currentOptions->setAutoPublishPost($options->getAutoPublishPost());
        $currentOptions->setAutoPublishComment($options->getAutoPublishComment());
        $currentOptions->setDisplayTitle($options->getDisplayTitle());
        $currentOptions->setBannerActivate($options->isBannerActivate());
        $currentOptions->setDisplayPostViewCounter($options->getDisplayPostViewCounter());
        $currentOptions->setBannerBackgroundColor($options->getBannerBackgroundColor());
        $currentOptions->setBannerHeight($options->getBannerHeight());
        $currentOptions->setBannerBackgroundImagePosition($options->getBannerBackgroundImagePosition());
        $currentOptions->setBannerBackgroundImageRepeat($options->getBannerBackgroundImageRepeat());
        $currentOptions->setTagCloud($options->getTagCloud());
        $currentOptions->setListWidgetBlog($options->getListWidgetBlog());
        $currentOptions->setTagTopMode($options->isTagTopMode());
        $currentOptions->setMaxTag($options->getMaxTag());
        $currentOptions->setCommentModerationMode($options->getCommentModerationMode());
        $currentOptions->setDisplayFullPosts($options->getDisplayFullPosts());

        $blog->setInfos($infos);

        $this->objectManager->flush();

        return $this->objectManager->getUnitOfWork();
    }

    public function getBlogBannerPath(BlogOptions $options)
    {
        if (null !== $options->getBannerBackgroundImage()) {
            $bannerPath = $this->uploadDir.DIRECTORY_SEPARATOR.$options->getBannerBackgroundImage();
            if (file_exists($bannerPath)) {
                return $bannerPath;
            }
        }

        return null;
    }

    public function getBlogBannerWebPath(BlogOptions $options)
    {
        return $options->getBannerBackgroundImage() ? $this->uploadDir.'/'.$options->getBannerBackgroundImage() : null;
    }

    /**
     * Get blog by its ID or UUID.
     *
     * @param string $id
     *
     * @return Blog
     */
    public function getBlogByIdOrUuid($id)
    {
        if (preg_match('/^\d+$/', $id)) {
            $blog = $this->repo->findOneBy([
                'id' => $id,
            ]);
        } else {
            $blog = $this->repo->findOneBy([
                'uuid' => $id,
            ]);
        }

        return $blog;
    }

    /**
     * Get tags used in the blog.
     *
     * @param Blog  $blog
     * @param array $posts
     *
     * @return array
     */
    public function getTags($blog, array $postData = [])
    {
        $postUuids = array_column($postData, 'id');

        $event = new GenericDataEvent([
            'class' => 'Icap\BlogBundle\Entity\Post',
            'ids' => $postUuids,
            'frequency' => true,
        ]);

        $this->eventDispatcher->dispatch(
            'claroline_retrieve_used_tags_by_class_and_ids',
            $event
        );
        $tags = $event->getResponse();

        //only keep max tag number, if defined
        if ($blog->getOptions()->isTagTopMode() && $blog->getOptions()->getMaxTag() > 0) {
            arsort($tags);
            $tags = array_slice($tags, 0, $blog->getOptions()->getMaxTag());
        }

        return (object) $tags;
    }

    /**
     * Find all member for a given user and the replace him by another.
     *
     * @param User $from
     * @param User $to
     */
    public function replaceMemberAuthor(User $from, User $to)
    {
        $fromIsMember = false;
        $froms = $this->memberRepo->findByUser($from);
        if (count($froms) > 0) {
            $fromIsMember = true;
        }

        $toIsMember = false;
        $tos = $this->memberRepo->findByUser($to);
        if (count($tos) > 0) {
            $toIsMember = true;
        }

        if ($toIsMember && $fromIsMember) {
            //user kept already have its member entry, delete the old one
            foreach ($froms as $member) {
                $this->objectManager->remove($member);
            }
            $this->objectManager->flush();
        } elseif (!$toIsMember && $fromIsMember) {
            //update entry for kept user
            foreach ($froms as $member) {
                $member->setUser($to);
            }
            $this->objectManager->flush();
        }
    }
}
