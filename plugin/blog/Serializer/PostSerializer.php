<?php

namespace Icap\BlogBundle\Serializer;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\API\Serializer\User\UserSerializer;
use Icap\BlogBundle\Entity\Post;
use Claroline\CoreBundle\Library\Normalizer\DateNormalizer;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.blog.post")
 * @DI\Tag("claroline.serializer")
 */
class PostSerializer
{
    use SerializerTrait;
    
    private $userSerializer;
    private $commentSerializer;
    private $userRepo;
    private $om;
    
    /**
     * PostSerializer constructor.
     *
     * @DI\InjectParams({
     *     "userSerializer"     = @DI\Inject("claroline.serializer.user"),
      *    "commentSerializer"  = @DI\Inject("claroline.serializer.blog.comment"),
     *     "om"                 = @DI\Inject("claroline.persistence.object_manager")
     * })
     *
     * @param UserSerializer       $userSerializer
     * @param ObjectManager        $om
     */
    public function __construct(
        UserSerializer $userSerializer,
        CommentSerializer $commentSerializer,
        ObjectManager $om
        ) {
            $this->userSerializer = $userSerializer;
            $this->commentSerializer = $commentSerializer;
            $this->userRepo = $om->getRepository('Claroline\CoreBundle\Entity\User');
            $this->tagRepo = $om->getRepository('Icap\BlogBundle\Entity\Tag');
            $this->om = $om;
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return 'Icap\BlogBundle\Entity\Post';
    }

    /**
     * @return string
     */
    public function getSchema()
    {
        return '#/plugin/blog/post.json';
    }
    
    /**
     * Checks if an option has been passed to the serializer.
     *
     * @param $option
     * @param array $options
     *
     * @return bool
     */
    private function hasOption($option, array $options = [])
    {
        return in_array($option, $options);
    }

    /**
     * @param Post  $post
     * @param array comments
     * @param array $options
     *
     * @return array - The serialized representation of a post
     */
    public function serialize(Post $post, array $options = [], array $comments = [])
    {
        $tags = [];
        foreach ($post->getTags() as $tag) {
            $tags[] = $tag->getName();
        }
        
        //serialize comments
        if(isset($options[CommentSerializer::INCLUDE_COMMENTS])){
            if($this->hasOption(CommentSerializer::FETCH_COMMENTS, $options)){
                $comments = $this->serializePostComments($post, $options);
            }
        }
        $commentsNumber = $post->countComments();
        $commentsNumberUnpublished = $post->countUnpublishedComments();

        return [
            'id' => $post->getUuid(),
            'slug' => $post->getSlug(),
            'title' => $post->getTitle(),
            'content' => isset($options['abstract']) && $options['abstract'] ? $post->getAbstract() : $post->getContent(),
            'abstract' => $this->isAbstract($post, $options),
            'creationDate' => $post->getCreationDate() ? DateNormalizer::normalize($post->getCreationDate()) : new \DateTime(),
            'modificationDate' => $post->getModificationDate() ? DateNormalizer::normalize($post->getModificationDate()) : null,
            'publicationDate' => $post->getPublicationDate() ? DateNormalizer::normalize($post->getPublicationDate()) : new \DateTime(),
            'viewCounter' => $post->getViewCounter(),
            'author' => $post->getAuthor() ? $this->userSerializer->serialize($post->getAuthor()) : null,
            'authorName' => $post->getAuthor() ? $post->getAuthor()->getFullName() : null,
            'authorPicture' => $post->getAuthor()->getPicture(),
            'tags' => $tags,
            'comments' => $comments,
            'commentsNumber' => $commentsNumber,
            'commentsNumberUnpublished' => $commentsNumberUnpublished,
            'isPublished' => $post->isPublished(),
        ];
    }
    
    /**
     * @param Post  $post
     * @param array $options
     *
     * @return array - Check if post content is truncated
     */
    private function isAbstract(Post $post, array $options = []){
        if (isset($options['abstract']) && $options['abstract']) {
            if ($post->getAbstract() !== $post->getContent()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @param array       $data
     * @param Post | null $post
     * @param array       $options
     *
     * @return Post - The deserialized post entity
     */
    public function deserialize($data, Post $post = null, array $options = [])
    {
        if (empty($post)) {
            $post = new Post();
        }
        $this->sipe('id', 'setUuid', $data, $post);
        if (isset($data['title'])) {
            $post->setTitle($data['title']);
        }
        if (isset($data['content'])) {
            $post->setContent($data['content']);
        }
        if (isset($data['creationDate'])) {
            $post->setCreationDate(DateNormalizer::denormalize($data['creationDate']));
        }
        if (isset($data['publicationDate'])) {
            $post->setPublicationDate(DateNormalizer::denormalize($data['publicationDate']));
        }
        if (isset($data['modificationDate'])) {
            $post->setModificationDate(DateNormalizer::denormalize($data['modificationDate']));
        }
        if (isset($data['viewCounter'])) {
            $post->setViewCounter($data['viewCounter']);
        }
        if (isset($data['user'])) {
            $user = isset($data['user']['id']) ? $this->userRepo->findOneBy(['id' => $data['user']['id']]) : null;
            $post->setAuthor($user);
        }
        if (isset($data['tags'])) {
            $tags = [];
            foreach ($data['tags'] as $tag) {
                $existingTag = $this->tagRepo->findOneByName($tag);
                if(isset($existingTag)){
                    $tags[] = $existingTag;
                }
            }
            $post->setTags($tags);    
        }
       
        return $post;
    }
    
    
    /**
     * Serialize post comments
     *
     * @param Post $post
     * @param array $options
     *
     * @return array - The serialized representation comments
     */
    public function serializePostComments(Post $post, array $options = [])
    {
        $comments = [];
        foreach ($post->getComments() as $comment) {
            $comments[] = $this->commentSerializer->serialize($comment);
        }
        
        return $comments;
    }
    
}
