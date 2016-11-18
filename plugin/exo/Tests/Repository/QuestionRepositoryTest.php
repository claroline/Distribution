<?php

namespace UJM\ExoBundle\Tests\Repository;

use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Repository\QuestionRepository;
use UJM\ExoBundle\Library\Testing\Persister;

class QuestionRepositoryTest extends TransactionalTestCase
{
    /**
     * @var ObjectManager
     */
    private $om;

    /**
     * @var Persister
     */
    private $persist;

    /**
     * @var QuestionRepository
     */
    private $repo;

    protected function setUp()
    {
        parent::setUp();
        $this->om = $this->client->getContainer()->get('claroline.persistence.object_manager');

        $this->persist = new Persister($this->om);
        $this->repo = $this->om->getRepository('UJMExoBundle:Question');
    }

    public function testFindByUser()
    {
        $q1 = $this->persist->qcmQuestion('qcm1');
        $q2 = $this->persist->qcmQuestion('qcm2');
        $q3 = $this->persist->qcmQuestion('qcm3');
        $u1 = $this->persist->user('u1');
        $u2 = $this->persist->user('u2');
        $c1 = $this->persist->category('c1', $u1);

        $q1->setUser($u1);
        $q2->setUser($u1);
        $q3->setUser($u2);
        $q1->setCategory($c1);
        $q2->setCategory($c1);
        $q3->setCategory($c1);

        $this->om->flush();

        $questions = $this->repo->findByUser($u1);
        $this->assertEquals([$q1, $q2], $questions);
    }

    public function testFindByExercise()
    {
        //Il faut rajouter les steps..
        $q1 = $this->persist->qcmQuestion('qcm1');
        $q2 = $this->persist->qcmQuestion('qcm2');
        $this->persist->qcmQuestion('qcm3'); // extr

        $e1 = $this->persist->exercise('ex1', [$q1, $q2]);
        $this->om->flush();

        $questions = $this->repo->findByExercise($e1);

        $this->assertEquals([$q1, $q2], $questions);
    }

    public function testFindByUserNotInExercise()
    {
        $u1 = $this->persist->user('u1');
        $u2 = $this->persist->user('u2');
        $q1 = $this->persist->qcmQuestion('q1');
        $q2 = $this->persist->qcmQuestion('q2');
        $q3 = $this->persist->qcmQuestion('q3');
        $q4 = $this->persist->qcmQuestion('q4');
        $q5 = $this->persist->qcmQuestion('q5');
        $e1 = $this->persist->exercise('e1', [$q1, $q2]);

        $q1->setUser($u1);
        $q2->setUser($u2);
        $q3->setUser($u1);
        $q4->setUser($u2);
        $q5->setUser($u1);

        $q5->setModel(true);

        $this->om->flush();

        $questions = $this->repo->findByUserNotInExercise($u1, $e1);
        $this->assertEquals([$q3, $q5], $questions);
        $questions = $this->repo->findByUserNotInExercise($u1, $e1, true);
        $this->assertEquals([$q5], $questions);
    }
}
