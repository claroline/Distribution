<?php

namespace UJM\ExoBundle\Transfer;

use Claroline\CoreBundle\Entity\Workspace\Workspace;
use Claroline\CoreBundle\Library\Transfert\Importer;
use JMS\DiExtraBundle\Annotation as DI;
use UJM\ExoBundle\Library\Options\Transfer;
use UJM\ExoBundle\Manager\ExerciseManager;

/**
 * @DI\Service("ujm_exo.importer.exercise")
 * @DI\Tag("claroline.importer")
 */
class ExerciseImporter extends Importer
{
    /**
     * @var ExerciseManager
     */
    private $exerciseManager;

    /**
     * ExerciseImporter constructor.
     *
     * @DI\InjectParams({
     *     "exerciseManager" = @DI\Inject("ujm_exo.manager.exercise")
     * })
     *
     * @param ExerciseManager $exerciseManager
     */
    public function __construct(ExerciseManager $exerciseManager)
    {
        $this->exerciseManager = $exerciseManager;
    }

    public function getName()
    {
        return 'ujm_exercise';
    }

    public function validate(array $data)
    {
    }

    public function import(array $data)
    {
        $exerciseData = json_decode(json_encode($data['data']));

        // Remove UUID to force the generation of a new one
        $exerciseData->id = '';

        $exercise = $this->exerciseManager->create($exerciseData);

        return $exercise;
    }

    public function export(Workspace $workspace, array &$files, $exercise)
    {
        $exerciseData = $this->exerciseManager->export($exercise, [Transfer::INCLUDE_SOLUTIONS]);

        $exerciseData = json_decode(json_encode($exerciseData), true);

        return $exerciseData;
    }
}
