<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\ClacoFormBundle\Entity;

use Claroline\CoreBundle\Entity\Facet\FieldFacet;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Groups;
use JMS\Serializer\Annotation\SerializedName;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 * @ORM\Table(name="claro_clacoformbundle_field")
 */
class Field
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @Groups({"api_claco_form", "api_user_min"})
     * @SerializedName("id")
     */
    protected $id;

    /**
     * @ORM\Column(name="field_name")
     * @Assert\NotBlank()
     * @Groups({"api_claco_form", "api_user_min"})
     * @SerializedName("name")
     */
    protected $name;

    /**
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\ClacoFormBundle\Entity\ClacoForm",
     *     inversedBy="fields"
     * )
     * @ORM\JoinColumn(name="claco_form_id", nullable=false, onDelete="CASCADE")
     * @Groups({"api_claco_form", "api_user_min"})
     * @SerializedName("clacoForm")
     */
    protected $clacoForm;

    /**
     * @ORM\OneToOne(targetEntity="Claroline\CoreBundle\Entity\Facet\FieldFacet")
     * @ORM\JoinColumn(onDelete="CASCADE")
     * @Groups({"api_user_min"})
     * @SerializedName("field")
     */
    protected $field;

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getClacoForm()
    {
        return $this->clacoForm;
    }

    public function setClacoForm(ClacoForm $clacoForm)
    {
        $this->clacoForm = $clacoForm;
    }

    public function getField()
    {
        return $this->field;
    }

    public function setField(FieldFacet $field)
    {
        $this->field = $field;
    }
}
