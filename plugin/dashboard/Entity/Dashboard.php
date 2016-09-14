<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DashboardBundle\Entity;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity()
 * @ORM\Table(name="claro_dashboard")
 */
class Dashboard
{
    /**
     * @ORM\Column(type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(length=50)
     * @Assert\NotBlank()
     */
    private $title;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="creation_date", type="datetime")
     * @Gedmo\Timestampable(on="create")
     */
    protected $creationDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="modification_date", type="datetime")
     * @Gedmo\Timestampable(on="update")
     */
    protected $modificationDate;

    /**
     * @var \Claroline\CoreBundle\Entity\User
     *
     * @ORM\ManyToOne(
     *     targetEntity="Claroline\CoreBundle\Entity\User"
     * )
     */
    protected $creator;

    /**
     * @var \Claroline\CoreBundle\Entity\Workspace\Workspace
     *
     * @ORM\ManyToMany(
     *      targetEntity="Claroline\CoreBundle\Entity\Workspace\Workspace"
     * )
     * @ORM\JoinTable(name="dashboard_workspaces",
     *      joinColumns={@ORM\JoinColumn(name="dashboard_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="workspace_id", referencedColumnName="id")}
     *      )
     */
    protected $workspaces;

    public function __construct()
    {
        $this->workspaces = new ArrayCollection();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function addWorkspace(Workspace $workspace)
    {
        $this->workspaces[] = $workspace;

        return $this;
    }

    public function removeWorkspace(Workspace $workspace)
    {
        $this->workspaces->removeElement($workspace);

        return $this;
    }

    public function getWorkspaces()
    {
        return $this->workspaces;
    }

    public function setCreator(User $user)
    {
        $this->creator = $user;

        return $this;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function getModificationDate()
    {
        return $this->modificationDate;
    }

    public function getCreationDate()
    {
        return $this->creationDate;
    }
}
