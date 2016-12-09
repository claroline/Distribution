<?php

namespace UJM\ExoBundle\Tests\Library\Attempt;

use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Testing\TransactionalTestCase;
use Claroline\CoreBundle\Persistence\ObjectManager;
use UJM\ExoBundle\Entity\Exercise;
use UJM\ExoBundle\Entity\Question\Question;
use UJM\ExoBundle\Entity\Step;
use UJM\ExoBundle\Library\Attempt\PaperGenerator;
use UJM\ExoBundle\Library\Options\Recurrence;
use UJM\ExoBundle\Library\Testing\Persister;

class PaperGeneratorTest extends TransactionalTestCase
{
    /**
     * @var ObjectManager|\PHPUnit_Framework_MockObject_MockObject
     */
    private $om;

    /**
     * @var Persister
     */
    private $persist;

    /**
     * @var Exercise
     */
    private $exercise;

    /**
     * @var Question[]
     */
    private $questions;

    /**
     * @var User
     */
    private $user;

    protected function setUp()
    {
        parent::setUp();

        $this->om = $this->client->getContainer()->get('claroline.persistence.object_manager');
        $this->persist = new Persister($this->om);

        // Initialize some base data for tests
        $this->user = $this->persist->user('john');

        $this->questions = [
            [
                $this->persist->openQuestion('Open question 1'),
                $this->persist->openQuestion('Open question 2'),
                $this->persist->openQuestion('Open question 3'),
                $this->persist->openQuestion('Open question 4'),
            ], [
                $this->persist->openQuestion('Open question 5'),
                $this->persist->openQuestion('Open question 6'),
                $this->persist->openQuestion('Open question 7'),
                $this->persist->openQuestion('Open question 8'),
            ], [
                $this->persist->openQuestion('Open question 9'),
                $this->persist->openQuestion('Open question 10'),
                $this->persist->openQuestion('Open question 11'),
                $this->persist->openQuestion('Open question 12'),
            ], [
                $this->persist->openQuestion('Open question 13'),
                $this->persist->openQuestion('Open question 14'),
                $this->persist->openQuestion('Open question 15'),
                $this->persist->openQuestion('Open question 16'),
            ],
        ];

        $this->exercise = $this->persist->exercise('Exercise 1', $this->questions, $this->user);

        $this->om->flush();
    }

    public function testPaperPropertiesAreCorrectlySet()
    {
        // Generate new attempt for the user and the exercise
        $newPaper = PaperGenerator::create($this->exercise, $this->user);

        $this->assertInstanceOf('UJM\ExoBundle\Entity\Attempt\Paper', $newPaper);

        // Checks the paper properties
        $this->assertEquals($newPaper->getExercise(), $this->exercise);
        $this->assertEquals($newPaper->getUser(), $this->user);
        $this->assertEquals($newPaper->getNumber(), 1);
        $this->assertFalse($newPaper->isAnonymized());

        $this->assertTrue(is_string($newPaper->getStructure()));
        $this->assertTrue(!empty($newPaper->getStructure()));
        $this->assertTrue(!empty($newPaper->getStart()));
        $this->assertTrue(empty($newPaper->getEnd()));
    }

    /**
     * The paper number MUST increment at each new attempt of a same user to a same exercise.
     */
    public function testPaperNumberIncrement()
    {
        $firstPaper = PaperGenerator::create($this->exercise, $this->user);
        $this->assertEquals(1, $firstPaper->getNumber());

        $secondPaper = PaperGenerator::create($this->exercise, $this->user, $firstPaper);
        $this->assertEquals(2, $secondPaper->getNumber());

        $thirdPaper = PaperGenerator::create($this->exercise, $this->user, $secondPaper);
        $this->assertEquals(3, $thirdPaper->getNumber());
    }

    /**
     * The generator MUST accept empty user to let the anonymous pass exercises.
     */
    public function testNoUserAllowed()
    {
        $paper = PaperGenerator::create($this->exercise);

        $this->assertTrue(empty($paper->getUser()));
    }

    /**
     * If exercise is not configured, the paper MUST contain all the steps in the defined order.
     */
    public function testDefaultPickSteps()
    {
        $newPaper = PaperGenerator::create($this->exercise, $this->user);
        $decodedStructure = json_decode($newPaper->getStructure());

        // Checks the generated structure for exercise
        $this->checkExerciseStructure($this->exercise, $decodedStructure);

        // Checks the order
        $pickedIds = array_map(function (\stdClass $pickedStep) {
            return $pickedStep->id;
        }, $decodedStructure);

        $stepIds = array_map(function (Step $step) {
            return $step->getUuid();
        }, $this->exercise->getSteps()->toArray());

        $this->assertEquals($stepIds, $pickedIds);
    }

    /**
     * If step is not configured, the paper MUST contain all the questions in the defined order.
     */
    public function testDefaultPickQuestions()
    {
        $newPaper = PaperGenerator::create($this->exercise, $this->user);
        $decodedStructure = json_decode($newPaper->getStructure());

        // Checks the generated structure for the step
        $step = $this->exercise->getSteps()->get(0);
        $this->checkStepStructure($step, $decodedStructure[0]);

        // Checks the order
        $questionIds = array_map(function (Question $question) {
            return $question->getUuid();
        }, $step->getQuestions());

        $this->assertEquals($questionIds, $decodedStructure[0]->items);
    }

    public function testRandomPickSteps()
    {
        // Set random picking for the exercise
        $this->exercise->setRandomPick(Recurrence::ALWAYS);
        $this->exercise->setPick(2);

        // Generate new attempt for the user and the exercise
        $paper = PaperGenerator::create($this->exercise, $this->user);
        $decodedStructure = json_decode($paper->getStructure());

        // Checks the generated structure for exercise
        $this->checkExerciseStructure($this->exercise, $decodedStructure);

        // Checks the random part : the generator MUST NOT return the same set each time
        $randomWork = false;
        for ($i = 0; $i < 5; ++$i) {
            // We loop 5 times because the generator can randomly generate many times the same set
            // Particularly if the whole steps set is small
            // This permits to avoid a false positive
            $newPaper = PaperGenerator::create($this->exercise, $this->user);
            $newStructure = json_decode($newPaper->getStructure());
            if ($decodedStructure !== $newStructure) {
                // The item list has changed so it works
                $randomWork = true;
                break;
            }
        }

        $this->assertTrue($randomWork);
    }

    public function testRandomPickQuestions()
    {
        // Set random picking for the step
        $step = $this->exercise->getSteps()->get(0);
        $step->setRandomPick(Recurrence::ALWAYS);
        $step->setPick(3);

        // Generate new attempt for the user and the exercise
        $paper = PaperGenerator::create($this->exercise, $this->user);
        $decodedStructure = json_decode($paper->getStructure());

        // Checks the generated structure for step
        $this->checkStepStructure($step, $decodedStructure[0]);

        // Checks the random part : the generator MUST NOT return the same set each time
        $randomWork = false;
        for ($i = 0; $i < 5; ++$i) {
            // We loop 5 times because the generator can randomly generate many times the same set
            // Particularly if the whole questions set is small
            // This permits to avoid a false positive
            $newPaper = PaperGenerator::create($this->exercise, $this->user);
            $newStructure = json_decode($newPaper->getStructure());
            if ($decodedStructure[0]->items !== $newStructure[0]->items) {
                // The item list has changed so it works
                $randomWork = true;
                break;
            }
        }

        $this->assertTrue($randomWork);
    }

    public function testRandomOrderSteps()
    {
        // Set random order for the exercise
        $this->exercise->setRandomOrder(Recurrence::ALWAYS);

        // Generate new attempt for the user and the exercise
        $paper = PaperGenerator::create($this->exercise, $this->user);
        $decodedStructure = json_decode($paper->getStructure());

        // Just check the random option do not break the whole structure
        $this->checkExerciseStructure($this->exercise, $decodedStructure);

        // Generate more papers to see if the steps are randomized
        $randomWork = false;
        for ($i = 0; $i < 5; ++$i) {
            // We loop 5 times because the generator can randomly generate many times the same order
            // Particularly if the whole steps set is small
            // This permits to avoid a false positive
            $newPaper = PaperGenerator::create($this->exercise, $this->user);
            $newStructure = json_decode($newPaper->getStructure());
            if ($decodedStructure !== $newStructure) {
                $randomWork = true;
                break;
            }
        }

        $this->assertTrue($randomWork);
    }

    public function testRandomOrderQuestions()
    {
        // Set random picking for the step
        $step = $this->exercise->getSteps()->get(0);
        $step->setRandomPick(Recurrence::ALWAYS);
        $step->setPick(3);

        // Generate new attempt for the user and the exercise
        $paper = PaperGenerator::create($this->exercise, $this->user);
        $decodedStructure = json_decode($paper->getStructure());

        // Just check the random option do not break the whole structure
        $this->checkStepStructure($step, $decodedStructure[0]);

        // Generate more papers to see if the questions are randomized
        $randomWork = false;
        for ($i = 0; $i < 5; ++$i) {
            // We loop 5 times because the generator can randomly generate many times the same order
            // Particularly if the whole questions set is small
            // This permits to avoid a false positive
            $newPaper = PaperGenerator::create($this->exercise, $this->user);
            $newStructure = json_decode($newPaper->getStructure());
            if ($decodedStructure[0]->items !== $newStructure[0]->items) {
                $randomWork = true;
                break;
            }
        }

        $this->assertTrue($randomWork);
    }

    /**
     * @expectedException \LogicException
     */
    public function testPickTooManyStepsThrowsException()
    {
        // Set random picking for the exercise
        $this->exercise->setRandomPick(Recurrence::ALWAYS);
        $this->exercise->setPick(6); // There is only 4 steps defined in the `setUp()` method

        // Generate new attempt for the user and the exercise
        PaperGenerator::create($this->exercise, $this->user);
    }

    /**
     * @expectedException \LogicException
     */
    public function testPickTooManyQuestionsThrowsException()
    {
        // Set random picking for the step
        $step = $this->exercise->getSteps()->get(0);
        $step->setRandomPick(Recurrence::ALWAYS);
        $step->setPick(6); // There is only 1 question defined in the `setUp()` method

        // Generate new attempt for the user and the exercise
        PaperGenerator::create($this->exercise, $this->user);
    }

    public function testDeletedStepIsNotPickedAgain()
    {
        // Set random picking for the exercise
        $this->exercise->setRandomPick(Recurrence::ONCE);
        $this->exercise->setPick(0); // Get all steps for easier test

        // Generate new attempt for the user and the exercise
        $firstPaper = PaperGenerator::create($this->exercise, $this->user);

        // Delete a step from the exercise
        $deletedStep = $this->exercise->getSteps()->get(0);
        $this->exercise->removeStep($deletedStep);

        // Creates a new attempt based on the structure of the first one
        $secondPaper = PaperGenerator::create($this->exercise, $this->user, $firstPaper);

        // Checks the deleted step does not appear in the new paper
        $decodedStructure = json_decode($secondPaper->getStructure());
        $pickedIds = array_map(function (\stdClass $step) {
            return $step->id;
        }, $decodedStructure);
        $this->assertFalse(in_array($deletedStep->getUuid(), $pickedIds));
    }

    public function testDeletedQuestionIsNotPickedAgain()
    {
        $this->markTestIncomplete(
            'This test has not been implemented yet.'
        );
    }

    /**
     * Checks the structure of an exercise has been generated accordingly to the generation options.
     * The structure MUST be an array of step structures.
     *
     * @param Exercise $exercise
     * @param mixed    $exerciseStructure
     */
    private function checkExerciseStructure(Exercise $exercise, $exerciseStructure)
    {
        $this->assertTrue(is_array($exerciseStructure));
        $this->assertTrue(!empty($exerciseStructure));

        // Check number of steps (the configured pick number or all the defined steps)
        $expectedCount = 0 !== $exercise->getPick() ? $exercise->getPick() : $exercise->getSteps()->count();
        $this->assertCount($expectedCount, $exerciseStructure);
    }

    /**
     * Checks the structure of a step has been generated accordingly to the generation options.
     * The structure MUST be an object containing the step uuid and a list of picked questions.
     *
     * @param Step  $step
     * @param mixed $stepStructure
     */
    private function checkStepStructure(Step $step, $stepStructure)
    {
        $this->assertTrue(!empty($stepStructure));
        $this->assertInstanceOf('\stdClass', $stepStructure);
        $this->assertEquals($stepStructure->id, $step->getUuid());
        $this->assertTrue(is_array($stepStructure->items));

        // Check number of questions (the configured pick number or all the defined questions)
        $expectedCount = 0 !== $step->getPick() ? $step->getPick() : $step->getStepQuestions()->count();
        $this->assertCount($expectedCount, $stepStructure->items);
    }
}
