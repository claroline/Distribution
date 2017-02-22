<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\ORM\Mapping as ORM;
use UJM\ExoBundle\Entity\Content\Image;

/**
 * A Image Content item.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_item_image_content")
 */
class ImageContentItem extends AbstractItem
{
    /**
     * The image of the content item.
     *
     * @ORM\ManyToOne(
     *     targetEntity="UJM\ExoBundle\Entity\Content\Image",
     *     cascade={"persist"}
     * )
     *
     * @var Image
     */
    private $image;

    /**
     * Gets image.
     *
     * @return Image
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Sets image.
     *
     * @param Image $image
     */
    public function setImage(Image $image)
    {
        $this->image = $image;
    }
}
