<?php

namespace Innova\PathBundle\Manager;

use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Innova\PathBundle\Entity\Path\Path;
use Innova\PathBundle\Entity\Step;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * Manages life cycle of paths.
 *
 * @DI\Service("innova_path.manager.path")
 *
 * @todo reworks import/export
 */
class PathManager
{
    /** @var ObjectManager */
    private $om;

    /** @var PlatformConfigurationHandler */
    private $platformConfig;

    /**
     * PathManager constructor.
     *
     * @DI\InjectParams({
     *     "om"             = @DI\Inject("claroline.persistence.object_manager"),
     *     "platformConfig" = @DI\Inject("claroline.config.platform_config_handler")
     * })
     *
     * @param ObjectManager                $om
     * @param PlatformConfigurationHandler $platformConfig
     */
    public function __construct(
        ObjectManager $om,
        PlatformConfigurationHandler $platformConfig
    ) {
        $this->om = $om;
        $this->platformConfig = $platformConfig;
    }

    public function export(Path $path, array &$files)
    {
        $data = [];

        // Get path data
        $pathData = [];
        $pathData['description'] = $path->getDescription();
        $pathData['summaryDisplayed'] = $path->getShowSummary();
        $pathData['manualProgressionAllowed'] = $path->isManualProgressionAllowed();

        // Get path structure into a file (to replace resources ID with placeholders)
        $uid = uniqid().'.txt';
        $tmpPath = $this->platformConfig->getParameter('tmp_dir').DIRECTORY_SEPARATOR.$uid;
        $structure = $path->getStructure();
        file_put_contents($tmpPath, $structure);
        $files[$uid] = $tmpPath;

        $pathData['structure'] = $uid;

        $data['path'] = $pathData;

        // Process Steps
        $data['steps'] = [];
        foreach ($path->getSteps() as $step) {
            $data['steps'][] = $this->exportStep($step);
        }

        return $data;
    }

    /**
     * Import a Path into the Platform.
     *
     * @param string $structure
     * @param array  $data
     * @param array  $resourcesCreated
     *
     * @return Path
     */
    public function import($structure, array $data, array $resourcesCreated = [])
    {
        // Create a new Path object which will be populated with exported data
        $path = new Path();

        $pathData = $data['data']['path'];

        // Populate Path properties
        $path->setDescription($pathData['description']);
        $path->setOpenSummary($pathData['summaryDisplayed']);
        $path->setManualProgressionAllowed($pathData['manualProgressionAllowed']);

        // Create steps
        $stepData = $data['data']['steps'];
        if (!empty($stepData)) {
            $createdSteps = [];
            foreach ($stepData as $step) {
                $createdSteps = $this->importStep($path, $step, $resourcesCreated, $createdSteps);
            }
        }

        // Inject empty structure into path (will be replaced by a version with updated IDs later in the import process)
        $path->setStructure($structure);

        return $path;
    }

    /**
     * Transform Step data to export it.
     *
     * @param Step $step
     *
     * @return array
     */
    public function exportStep(Step $step)
    {
        $parent = $step->getParent();
        $activity = $step->getActivity();

        $data = [
            'uid' => $step->getId(),
            'parent' => !empty($parent) ? $parent->getId() : null,
            'activityId' => !empty($activity) ? $activity->getId() : null,
            'activityNodeId' => !empty($activity) ? $activity->getResourceNode()->getId() : null,
            'order' => $step->getOrder(),
        ];

        return $data;
    }

    /**
     * Import a Step.
     *
     * @param Path  $path
     * @param array $data
     * @param array $createdResources
     * @param array $createdSteps
     *
     * @return array
     */
    public function importStep(Path $path, array $data, array $createdResources = [], array $createdSteps = [])
    {
        $step = new Step();

        $step->setPath($path);
        if (!empty($data['parent'])) {
            $step->setParent($createdSteps[$data['parent']]);
        }

        $step->setOrder($data['order']);
        $step->setActivityHeight(0);

        // Link Step to its Activity
        if (!empty($data['activityNodeId']) && !empty($createdResources[$data['activityNodeId']])) {
            // Step has an Activity
            $step->setActivity($createdResources[$data['activityNodeId']]);
        }

        $createdSteps[$data['uid']] = $step;

        $this->om->persist($step);

        return $createdSteps;
    }
}
