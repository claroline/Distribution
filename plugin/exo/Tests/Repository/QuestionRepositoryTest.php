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
        $this->repo = $this->om->getRepository('UJMExoBundle:Question\Question');
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
}
