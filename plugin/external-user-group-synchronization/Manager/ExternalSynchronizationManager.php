<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 4/13/17
 */

namespace Claroline\ExternalSynchronizationBundle\Manager;

use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\ExternalSynchronizationBundle\Repository\ExternalResourceSynchronizationRepository;
use Cocur\Slugify\Slugify;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Yaml\Dumper;
use Symfony\Component\Yaml\Parser;

/**
 * Class ExternalSynchronizationManager.
 *
 * @DI\Service("claroline.manager.external_user_group_sync_manager")
 */
class ExternalSynchronizationManager
{
    /** @var string */
    private $syncFilePath;
    /** @var ObjectManager */
    private $om;
    /** @var UserManager */
    private $userManager;
    /** @var GroupManager */
    private $groupManager;
    /** @var PlatformConfigurationHandler */
    private $platformConfigHandler;
    /** @var mixed */
    private $sourcesArray;
    /** @var Slugify */
    private $slugify;
    /** @var Parser */
    private $ymlParser;
    /** @var Dumper */
    private $ymlDumper;

    /**
     * @DI\InjectParams({
     *     "synchronizationDir"     = @DI\Inject("%claroline.param.synchronization_directory%"),
     *     "om"                     = @DI\Inject("claroline.persistence.object_manager"),
     *     "userManager"            = @DI\Inject("claroline.manager.user_manager"),
     *     "groupManager"           = @DI\Inject("claroline.manager.group_manager"),
     *     "platformConfigHandler"  = @DI\Inject("claroline.config.platform_config_handler")
     * })
     *
     * @param $synchronizationDir
     * @param ObjectManager                $om
     * @param UserManager                  $userManager
     * @param GroupManager                 $groupManager
     * @param PlatformConfigurationHandler $platformConfigHandler
     */
    public function __construct(
        $synchronizationDir,
        ObjectManager $om,
        UserManager $userManager,
        GroupManager $groupManager,
        PlatformConfigurationHandler $platformConfigHandler
    ) {
        $this->syncFilePath = $synchronizationDir.'external.sources.yml';
        $this->ymlParser = new Parser();
        $this->ymlDumper = new Dumper();
        $this->slugify = new Slugify();
        $this->om = $om;
        $this->userManager = $userManager;
        $this->groupManager = $groupManager;
        $this->platformConfigHandler = $platformConfigHandler;
        $this->sourcesArray = $this->loadExternalSources();
    }

    public function getExternalSourcesNames()
    {
        $sources = $this->sourcesArray['sources'];
        $names = [];
        foreach ($sources as $key => $source) {
            $names[$key] = $source['name'];
        }

        return $names;
    }

    public function getExternalSource($name)
    {
        $name = $this->slugifyName($name);

        return isset($this->sourcesArray['sources'][$name]) ? $this->sourcesArray['sources'][$name] : [];
    }

    public function setExternalSource($name, array $config, $oldName = null)
    {
        if (!is_null($oldName)) {
            $oldName = $this->slugifyName($oldName);
            if (isset($this->sourcesArray['sources'][$oldName])) {
                unset($this->sourcesArray['sources'][$oldName]);
            }
        }
        $name = $this->slugifyName($name);

        $this->sourcesArray['sources'][$name] = $config;

        return $this->saveConfig();
    }

    public function deleteExternalSource($sourceName)
    {
        if (isset($this->sourcesArray['sources'][$sourceName])) {
            unset($this->sourcesArray['sources'][$sourceName]);

            return $this->saveConfig();
        }

        return true;
    }

    public function getTableNames($sourceName)
    {
        $repo = $this->getRepositoryForExternalSource($this->getExternalSource($sourceName));

        return $repo->findTableNames();
    }

    public function getColumnNamesForTable($sourceName, $table)
    {
        $repo = $this->getRepositoryForExternalSource($this->getExternalSource($sourceName));

        return $repo->findColumnNames($table);
    }

    public function loadUsersForExternalSource($sourceName)
    {
        $externalSource = $this->getExternalSource($sourceName);
        $repo = $this->getRepositoryForExternalSource($externalSource);

        return $repo->findUsers();
    }

    public function loadGroupsForExternalSource($sourceName)
    {
        $externalSource = $this->getExternalSource($sourceName);
        $repo = $this->getRepositoryForExternalSource($externalSource);

        return $repo->findGroups();
    }

    public function saveConfig()
    {
        if (!empty($this->sourcesArray['sources'])) {
            return file_put_contents($this->syncFilePath, $this->ymlDumper->dump($this->sourcesArray, 3));
        }

        return false;
    }

    private function loadExternalSources()
    {
        $fs = new Filesystem();
        if (!$fs->exists($this->syncFilePath)) {
            if (!$fs->exists(dirname($this->syncFilePath))) {
                $fs->mkdir(dirname($this->syncFilePath), 0775);
                $fs->chmod(dirname($this->syncFilePath), 0775);
            }
            $fs->touch($this->syncFilePath);
        }
        $yml = $this->ymlParser->parse(file_get_contents($this->syncFilePath));

        return empty($yml) ? ['sources' => []] : $yml;
    }

    private function slugifyName($name)
    {
        return $this->slugify->slugify($name, '_');
    }

    private function getRepositoryForExternalSource($resourceConfig)
    {
        return new ExternalResourceSynchronizationRepository($resourceConfig);
    }
}
