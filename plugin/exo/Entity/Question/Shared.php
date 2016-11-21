<?php

namespace UJM\ExoBundle\Entity\Question;

use Claroline\CoreBundle\Entity\User;
use Doctrine\ORM\Mapping as ORM;

/**
 *
 *
 * @ORM\Entity()
 * @ORM\Table(name="ujm_share")
 */
class Shared
{
    /**
     * The user with whom the question is shared.
     *
     * @var User
     *
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Claroline\CoreBundle\Entity\User")
     */
    private $user;

    /**
     * The shared question.
     *
     * @var Question
     *
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="UJM\ExoBundle\Entity\Question\Question")
     */
    private $question;

    /**
     * Gives the user the ability to edit and delete the question.
     *
     * @var bool
     *
     * @ORM\Column(name="allowToModify", type="boolean")
     */
    private $adminRights = false;

    /**
     * Sets user.
     *
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }

    /**
     * Gets user.
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Sets question.
     *
     * @param Question $question
     */
    public function setQuestion(Question $question)
    {
        $this->question = $question;
    }

    /**
     * Gets question.
     *
     * @return Question
     */
    public function getQuestion()
    {
        return $this->question;
    }

    /**
     * Sets admin right.
     *
     * @param bool $adminRights
     */
    public function setAdminRights($adminRights)
    {
        $this->adminRights = $adminRights;
    }

    /**
     * Gets admin rights.
     *
     * @return bool
     */
    public function getAdminRights()
    {
        return $this->adminRights;
    }
}
