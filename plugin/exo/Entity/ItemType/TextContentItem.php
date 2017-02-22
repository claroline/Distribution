<?php

namespace UJM\ExoBundle\Entity\ItemType;

use Doctrine\ORM\Mapping as ORM;

/**
 * A Text Content item.
 *
 * @ORM\Entity
 * @ORM\Table(name="ujm_item_text_content")
 */
class TextContentItem extends AbstractItem
{
    /**
     * @ORM\Column(name="text_content", type="text")
     *
     * @var string
     */
    private $text;

    /**
     * Get text
     *
     * @return string
     */
    public function getText()
    {
        return $this->text;
    }

    /**
     * Set text
     *
     * @param string $text
     */
    public function setText($text)
    {
        $this->text = $text;
    }

    public function isContentItem()
    {
        return true;
    }
}
