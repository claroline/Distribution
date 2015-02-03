<?php

namespace Inwicast\ClarolinePluginBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Claroline\CoreBundle\Entity\Resource\AbstractResource;
use Claroline\CoreBundle\Entity\Widget\WidgetInstance;

/**
 * Media
 *
 * @ORM\Table(name="inwicast_plugin_media")
 * @ORM\Entity(repositoryClass="Inwicast\ClarolinePluginBundle\Entity\MediaRepository")
 */
class Media extends AbstractResource
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="code", type="string", length=255)
     */
    protected $code;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    protected $title;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="text")
     */
    protected $description;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="date")
     */
    protected $date;

    /**
     * @var string
     *
     * @ORM\Column(name="image", type="string", length=255)
     */
    protected $image;

    /**
     * @var integer
     *
     * @ORM\Column(name="width", type="integer")
     */
    protected $width;

    /**
     * @var integer
     *
     * @ORM\Column(name="height", type="integer")
     */
    protected $height;

    /**
     * @ORM\ManyToMany(targetEntity="Claroline\CoreBundle\Entity\Widget\WidgetInstance")
     * @ORM\JoinTable(name="inwicast_plugin_media_widgetinstance",
     *      joinColumns={@ORM\JoinColumn(name="media_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="widgetinstance_id", referencedColumnName="id", unique=true, onDelete="CASCADE")}
     *      )
     **/
    protected $widgetInstance;

     /**
     * @var \Claroline\CoreBundle\Entity\Resource\ResourceNode
     */
    protected $resourceNode;



    public function __construct($code = null, $title = null, $description = null, $date = null, $image = null, $width = null, $height = null)
    {
        $this->code = $code;
        $this->title = $title;
        $this->description = $description;
        $this->date = $date;
        $this->image = $image;
        $this->width = $width;
        $this->height = $height;
    }

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set code
     *
     * @param string $code
     * @return Media
     */
    public function setCode($code)
    {
        $this->code = $code;
    
        return $this;
    }

    /**
     * Get code
     *
     * @return string 
     */
    public function getCode()
    {
        return $this->code;
    }

    /**
     *
     * @param string $title
     * @return Media
     */
    public function setTitle($title)
    {
        $this->title = $title;
    
        return $this;
    }

    /**
     * Get title
     *
     * @return string 
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set description
     *
     * @param string $description
     * @return Media
     */
    public function setDescription($description)
    {
        $this->description = $description;
    
        return $this;
    }

    /**
     * Get description
     *
     * @return string 
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     * @return Media
     */
    public function setDate($date)
    {
        $this->date = $date;
    
        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime 
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set image
     *
     * @param string $image
     * @return Media
     */
    public function setImage($image)
    {
        $this->image = $image;
    
        return $this;
    }

    /**
     * Get image
     *
     * @return string 
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set width
     *
     * @param integer $width
     * @return Media
     */
    public function setWidth($width)
    {
        $this->width = $width;
    
        return $this;
    }

    /**
     * Get width
     *
     * @return integer 
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * Set height
     *
     * @param integer $height
     * @return Media
     */
    public function setHeight($height)
    {
        $this->height = $height;
    
        return $this;
    }

    /**
     * Get height
     *
     * @return integer 
     */
    public function getHeight()
    {
        return $this->height;
    }

     /**
     * Get widgetInstance
     *
     * @return WidgetInstance 
     */    
    public function getWidgetInstance()
    {
        return $this->widgetInstance;
    }

    /**
     * Add widgetInstance
     *
     * @param \Claroline\CoreBundle\Entity\Widget\WidgetInstance $widgetInstance
     * @return Media
     */
    public function addWidgetInstance(\Claroline\CoreBundle\Entity\Widget\WidgetInstance $widgetInstance)
    {
        $this->widgetInstance[] = $widgetInstance;

        return $this;
    }


    /**
     * Remove widgetInstance
     *
     * @param \Claroline\CoreBundle\Entity\Widget\WidgetInstance $widgetInstance
     */
    public function removeWidgetInstance(\Claroline\CoreBundle\Entity\Widget\WidgetInstance $widgetInstance)
    {
        $this->widgetInstance->removeElement($widgetInstance);
    }


    /**
     * Set resourceNode
     *
     * @param \Claroline\CoreBundle\Entity\Resource\ResourceNode $resourceNode
     * @return Media
     */
    public function setResourceNode(\Claroline\CoreBundle\Entity\Resource\ResourceNode $resourceNode = null)
    {
        $this->resourceNode = $resourceNode;

        return $this;
    }

    /**
     * Get resourceNode
     *
     * @return \Claroline\CoreBundle\Entity\Resource\ResourceNode
     */
    public function getResourceNode()
    {
        return $this->resourceNode;
    }

}
