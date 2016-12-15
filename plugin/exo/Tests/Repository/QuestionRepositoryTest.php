<?php

namespace UJM\ExoBundle\Tests\Repository;

use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Library\Testing\Persister;
use UJM\ExoBundle\Repository\QuestionRepository;

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

    /**
     * A list of questions that can be used in all tests.
     *
     * @var Question[]
     */
    private $questions = [];

    protected function setUp()
    {
        parent::setUp();

        $this->om = $this->client->getContainer()->get('claroline.persistence.object_manager');
        $this->persist = new Persister($this->om);
        $this->repo = $this->om->getRepository('UJMExoBundle:Question\Question');

        // Creates some questions
        $this->questions = [
            $this->persist->choiceQuestion('qcm1'),
            $this->persist->choiceQuestion('qcm2'),
            $this->persist->choiceQuestion('qcm3'),
            $this->persist->choiceQuestion('qcm4'),
        ];

        $this->om->flush();
    }

    public function testSearch()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * The repository MUST return the list of exercise using the question.
     */
    public function testFindUsedBy()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * The repository MUST return the list of questions used by an exercise.
     */
    public function testFindByExercise()
    {
        // Creates an exercise that use some of the test questions
        $exercise = $this->persist->exercise('ex1', [$this->questions[0], $this->questions[1]]);
        $this->om->flush();

        // Retrieve the list of questions used by the exercise
        $questions = $this->repo->findByExercise($exercise);

        $this->assertEquals([$this->questions[0], $this->questions[1]], $questions);
    }

    /**
     * The repository MUST return the list of questions referenced by the given UUIDs.
     */
    public function testFindByUuids()
    {
        // The list of questions we want to retrieve
        $questionUuids = [
            $this->questions[0]->getUuid(),
            $this->questions[1]->getUuid(),
            $this->questions[2]->getUuid(),
        ];

        $questions = $this->repo->findByUuids($questionUuids);
        $this->assertEquals([$this->questions[0], $this->questions[1], $this->questions[2]], $questions);
    }
}
