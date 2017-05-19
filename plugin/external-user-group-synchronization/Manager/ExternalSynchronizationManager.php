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

use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\User;
use Claroline\CoreBundle\Library\Configuration\PlatformConfigurationHandler;
use Claroline\CoreBundle\Manager\GroupManager;
use Claroline\CoreBundle\Manager\PluginManager;
use Claroline\CoreBundle\Manager\UserManager;
use Claroline\CoreBundle\Persistence\ObjectManager;
use Claroline\ExternalSynchronizationBundle\Entity\ExternalUser;
use Claroline\ExternalSynchronizationBundle\Repository\ExternalResourceSynchronizationRepository;
use Cocur\Slugify\Slugify;
use JMS\DiExtraBundle\Annotation as DI;
use Symfony\Component\DependencyInjection\ContainerInterface;
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
    use LoggableTrait;

    /** @var string */
    private $syncFilePath;
    /** @var ObjectManager */
    private $om;
    /** @var UserManager */
    private $userManager;
    /** @var GroupManager */
    private $groupManager;
    /** @var ExternalSynchronizationUserManager */
    private $externalUserManager;
    /** @var \Claroline\CasBundle\Manager\CasManager|object */
    private $casManager;
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
     *     "externalUserManager"    = @DI\Inject("claroline.manager.external_user_sync_manager"),
     *     "groupManager"           = @DI\Inject("claroline.manager.group_manager"),
     *     "pluginManager"          = @DI\Inject("claroline.manager.plugin_manager"),
     *     "container"              = @DI\Inject("service_container"),
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
        ExternalSynchronizationUserManager $externalUserManager,
        GroupManager $groupManager,
        PluginManager $pluginManager,
        ContainerInterface $container,
        PlatformConfigurationHandler $platformConfigHandler
    ) {
        $this->syncFilePath = $synchronizationDir.'external.sources.yml';
        $this->ymlParser = new Parser();
        $this->ymlDumper = new Dumper();
        $this->slugify = new Slugify();
        $this->om = $om;
        $this->userManager = $userManager;
        $this->externalUserManager = $externalUserManager;
        $this->groupManager = $groupManager;
        $this->platformConfigHandler = $platformConfigHandler;
        $this->sourcesArray = $this->loadExternalSources();
        $this->casManager = null;
        if ($pluginManager->isLoaded('ClarolineCasBundle')) {
            $this->casManager = $container->get('claroline.manager.cas_manager');
        }
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

    public function getTableAndViewNames($sourceName)
    {
        $repo = $this->getRepositoryForExternalSource($this->getExternalSource($sourceName));

        $names = [];
        try {
            $names = $repo->findTableNames();
        } catch (\Exception $e) {
            unset($e);
        }
        try {
            $names = array_merge($names, $repo->findViewNames());
        } catch (\Exception $e) {
            unset($e);
        }

        return $names;
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

    public function searchGroupsForExternalSource($sourceName, $search = null, $max = -1)
    {
        $externalSource = $this->getExternalSource($sourceName);
        $repo = $this->getRepositoryForExternalSource($externalSource);

        return $repo->findGroups($search, $max);
    }

    public function synchronizeUsersForExternalSource(
        $sourceName,
        $synchronizeCas = false,
        $casSychronizedField = 'username'
    ) {
        // Initialize parameters
        $batchSize = 60;
        $sourceName = $this->slugifyName($sourceName);
        $casSychronizedField = ucfirst($casSychronizedField);
        // Get external source repository
        $externalSource = $this->getExternalSource($sourceName);
        $externalSourceRepo = $this->getRepositoryForExternalSource($externalSource);

        // Count users in external source to synchronize
        $countUsers = $externalSourceRepo->countUsers(true);
        $this->log("Synchronizing {$countUsers} users for source '{$externalSource['name']}'");
        // While there are still users to sync
        $cnt = 0;
        while ($countUsers > 0) {
            // Current batch size
            $curBatchSize = min($batchSize, $countUsers);
            $firstUserIndex = $cnt * $batchSize;
            $lastUserIndex = $firstUserIndex + $curBatchSize;
            $this->log("Syncing users {$firstUserIndex} -> {$lastUserIndex}");
            // Get users from external source
            $externalSourceUsers = $externalSourceRepo->findUsers($curBatchSize, $cnt, true);
            $externalSourceUserIds = array_column($externalSourceUsers, 'id');
            $externalSourceUserUsernames = array_column($externalSourceUsers, 'username');
            $externalSourceUserEmails = array_column($externalSourceUsers, 'email');
            // Get already synchronized users
            $alreadyImportedUsers = $this
                ->externalUserManager
                ->getExternalUsersByExternalIdsAndSourceSlug($externalSourceUserIds, $sourceName);
            $alreadyImportedUserIds = array_map(
                function (ExternalUser $extUser) {
                    return $extUser->getExternalUserId();
                },
                $alreadyImportedUsers
            );
            // Get already existing users by username or mail in platform
            $existingPlatformUsers = $this
                ->userManager
                ->getUsersByUsernamesOrMails($externalSourceUserUsernames, $externalSourceUserEmails, true);
            $existingPlatformUserUsernames = array_map(
                function (User $user) {
                    return $user->getUsername();
                },
                $alreadyImportedUsers
            );
            $existingPlatformUserMails = array_map(
                function (User $user) {
                    return $user->getMail();
                },
                $alreadyImportedUsers
            );
            // If CAS enabled get existing user in CAS
            $existingCasUsers = [];
            $existingCasUserIds = [];
            if ($synchronizeCas && !is_null($this->casManager) && isset(${"externalSourceUser${casSychronizedField}s"})) {
                $existingCasUsers = $this
                    ->casManager
                    ->getCasUsersByCasIds(${"externalSourceUser${casSychronizedField}s"});
                $existingCasUserIds = array_map(
                    function ($casUser) {
                        return $casUser->getCasId();
                    },
                    $existingCasUsers
                );
            }
            // TODO: random password random_bytes(10);
            // unset for commit
            unset($alreadyImportedUserIds);
            unset($existingPlatformUsers);
            unset($existingPlatformUserUsernames);
            unset($existingPlatformUserMails);
            unset($existingCasUsers);
            unset($existingCasUserIds);

            $countUsers -= $curBatchSize;
            ++$cnt;
        }

        return $countUsers;
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
