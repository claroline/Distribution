<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\OpenBadgeBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro__open_badge_badge_class")
 */
class BadgeClass
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     *
     * @var int
     */
    private $id;

    /**
     * @ORM\Column()
     *
     * @var string
     */
    private $iri;

    /**
     * @ORM\Column(type="json_array")
     *
     * @var array
     */
    private $type = ['BadgeClass'];

    /**
     * @ORM\Column()
     *
     * @var string
     */
    private $name;

    /**
     * @ORM\Column(type="text")
     *
     * @var string
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Image")
     *
     * @var Image
     */
    private $image;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Criteria")
     *
     * @var Criteria
     */
    private $criteria;

    /**
     * @ORM\ManyToOne(targetEntity="Claroline\OpenBadgeBundle\Entity\Profile")
     *
     * @var Profile
     */
    private $issuer;

    /**
     * @ORM\ManyToMany(targetEntity="Claroline\OpenBadgeBundle\Entity\AlignmentObject")
     *
     * @var AlignmentObject
     */
    private $alignments;

    /**
     * @ORM\Column(type="json_array")
     *
     * @var array
     */
    private $tags = [];

    /**
     * Get the value of Id.
     *
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set the value of Id.
     *
     * @param mixed id
     *
     * @return self
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Get the value of Iri.
     *
     * @return mixed
     */
    public function getIri()
    {
        return $this->iri;
    }

    /**
     * Set the value of Iri.
     *
     * @param mixed iri
     *
     * @return self
     */
    public function setIri($iri)
    {
        $this->iri = $iri;

        return $this;
    }

    /**
     * Get the value of Type.
     *
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * Set the value of Type.
     *
     * @param mixed type
     *
     * @return self
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * Get the value of Name.
     *
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set the value of Name.
     *
     * @param mixed name
     *
     * @return self
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get the value of Description.
     *
     * @return mixed
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set the value of Description.
     *
     * @param mixed description
     *
     * @return self
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get the value of Image.
     *
     * @return mixed
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set the value of Image.
     *
     * @param mixed image
     *
     * @return self
     */
    public function setImage($image)
    {
        $this->image = $image;

        return $this;
    }

    /**
     * Get the value of Criteria.
     *
     * @return mixed
     */
    public function getCriteria()
    {
        return $this->criteria;
    }

    /**
     * Set the value of Criteria.
     *
     * @param mixed criteria
     *
     * @return self
     */
    public function setCriteria($criteria)
    {
        $this->criteria = $criteria;

        return $this;
    }

    /**
     * Get the value of Issuer.
     *
     * @return mixed
     */
    public function getIssuer()
    {
        return $this->issuer;
    }

    /**
     * Set the value of Issuer.
     *
     * @param mixed issuer
     *
     * @return self
     */
    public function setIssuer($issuer)
    {
        $this->issuer = $issuer;

        return $this;
    }

    /**
     * Get the value of Alignments.
     *
     * @return mixed
     */
    public function getAlignments()
    {
        return $this->alignments;
    }

    /**
     * Set the value of Alignments.
     *
     * @param mixed alignments
     *
     * @return self
     */
    public function setAlignments($alignments)
    {
        $this->alignments = $alignments;

        return $this;
    }

    /**
     * Get the value of Tags.
     *
     * @return mixed
     */
    public function getTags()
    {
        return $this->tags;
    }

    /**
     * Set the value of Tags.
     *
     * @param mixed tags
     *
     * @return self
     */
    public function setTags($tags)
    {
        $this->tags = $tags;

        return $this;
    }
}
