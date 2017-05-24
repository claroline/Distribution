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
use Claroline\ExternalSynchronizationBundle\Entity\ExternalGroup;
use Claroline\ExternalSynchronizationBundle\Entity\ExternalUser;
use Claroline\ExternalSynchronizationBundle\Repository\ExternalResourceSynchronizationRepository;
use Cocur\Slugify\Slugify;
use JMS\DiExtraBundle\Annotation as DI;
use Psr\Log\LoggerInterface;
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

    const USER_BATCH_SIZE = 60;

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
    /** @var ExternalSynchronizationGroupManager */
    private $externalGroupManager;
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
     *     "externalGroupManager"   = @DI\Inject("claroline.manager.external_user_group_sync_group_manager"),
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
        ExternalSynchronizationGroupManager $externalGroupManager,
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
        $this->externalGroupManager = $externalGroupManager;
        $this->groupManager = $groupManager;
        $this->platformConfigHandler = $platformConfigHandler;
        $this->sourcesArray = $this->loadExternalSources();
        $this->casManager = null;
        if ($pluginManager->isLoaded('ClarolineCasBundle')) {
            $this->casManager = $container->get('claroline.manager.cas_manager');
        }
    }

    public function getExternalSourcesNames($filterBy = ['user_config', 'group_config'])
    {
        $sources = $this->sourcesArray['sources'];
        $names = [];
        foreach ($sources as $key => $source) {
            if ($this->isPropertyConfigured($source, $filterBy)) {
                $names[$key] = $source['name'];
            }
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

<<<<<<< HEAD
    public function searchGroupsForExternalSource($sourceName, $search = null, $max = -1)
=======
    public function loadGroupsForExternalSource($sourceName, $search)
>>>>>>> 5daf605... Admin pages for importing external groups into workspace
    {
        $externalSource = $this->getExternalSource($sourceName);
        $repo = $this->getRepositoryForExternalSource($externalSource);

<<<<<<< HEAD
        return $repo->findGroups($search, $max);
<<<<<<< HEAD
=======
    }

    public function getExternalSourceGroupById($sourceName, $groupId)
    {
        $externalSource = $this->getExternalSource($sourceName);
        $repo = $this->getRepositoryForExternalSource($externalSource);

        return $repo->findOneGroupById($groupId);
>>>>>>> 7da0a3b... Created commands for user and group synchronization
    }

    public function synchronizeUsersForExternalSource(
        $sourceName,
        $synchronizeCas = false,
        $casSynchronizedField = 'username'
    ) {
        // Initialize parameters
        $batchSize = self::USER_BATCH_SIZE;
        $sourceName = $this->slugifyName($sourceName);
        $casSynchronizedFieldUcf = ucfirst($casSynchronizedField);
        // Get external source repository
        $externalSource = $this->getExternalSource($sourceName);
        $externalSourceRepo = $this->getRepositoryForExternalSource($externalSource);

        // Count users in external source to synchronize
        $countUsers = $externalSourceRepo->countUsers(true);
        $this->log("Synchronizing {$countUsers} users for source '{$externalSource['name']}'");
        // Start flash suite
        // While there are still users to sync
        $cnt = 0;
        // Liste of already examined usernames and mails
        $existingCasUsers = [];
        $existingCasUserIds = [];
        $this->om->allowForceFlush(false);
        while ($countUsers > 0) {
            $this->om->startFlushSuite();
            // Current batch size
            $curBatchSize = min($batchSize, $countUsers);
            $firstUserIndex = $cnt * $batchSize;
            $lastUserIndex = $firstUserIndex + $curBatchSize;
            $this->log("Syncing users {$firstUserIndex} -> {$lastUserIndex}");
            // Get users from external source
            $externalSourceUsers = $externalSourceRepo->findUsers($batchSize, $cnt, true);
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
                $existingPlatformUsers
            );
            $existingPlatformUserMails = array_map(
                function (User $user) {
                    return $user->getMail();
                },
                $existingPlatformUsers
            );
            // If CAS enabled get existing user in CAS
            if (
                $synchronizeCas &&
                !is_null($this->casManager) &&
                isset(${"externalSourceUser${casSynchronizedFieldUcf}s"})
            ) {
                $existingCasUsers = $this
                    ->casManager
                    ->getCasUsersByCasIds(${"externalSourceUser${casSynchronizedFieldUcf}s"});
                $existingCasUserIds = array_map(
                    function ($casUser) {
                        return $casUser->getCasId();
                    },
                    $existingCasUsers
                );
            }
            $syncedUserUsernames = [];
            $syncedUserEmails = [];
            // For every user
            foreach ($externalSourceUsers as $externalSourceUser) {
                // If user already examined, ommit user
                if (
                    in_array($externalSourceUser['username'], $syncedUserUsernames) ||
                    in_array($externalSourceUser['email'], $syncedUserEmails)
                ) {
                    continue;
                }
                $syncedUserUsernames[] = $externalSourceUser['username'];
                $syncedUserEmails[] = $externalSourceUser['email'];
                $this->log("Syncing user: {$externalSourceUser['username']}");
                $alreadyImportedUser = null;
                $casAccount = null;
                // Test if user already imported
                if (($key = array_search($externalSourceUser['id'], $alreadyImportedUserIds)) !== false) {
                    $alreadyImportedUser = $alreadyImportedUsers[$key];
                }
                // If user not already imported test if a CAS account is connected to it
                if (
                    is_null($alreadyImportedUser) &&
                    !empty($existingCasUsers) &&
                    ($key = array_search($externalSourceUser[$casSynchronizedField], $existingCasUserIds)) !== false
                ) {
                    $casAccount = $existingCasUsers[$key];
                    $alreadyImportedUser = $this->externalUserManager->createExternalUser(
                        $externalSourceUser['id'],
                        $sourceName,
                        $casAccount->getUser()
                    );
                }
                // If user mail exists already in platform then link with this account
                if (
                    is_null($alreadyImportedUser) &&
                    !empty($existingPlatformUserMails) &&
                    ($key = array_search($externalSourceUser['email'], $existingPlatformUserMails)) !== false
                ) {
                    $platformUser = $existingPlatformUsers[$key];
                    $alreadyImportedUser = $this->externalUserManager->createExternalUser(
                        $externalSourceUser['id'],
                        $sourceName,
                        $platformUser
                    );
                }
                $user = is_null($alreadyImportedUser) ? null : $alreadyImportedUser->getUser();
                // If user doesn't exist create it
                if (is_null($user)) {
                    // Otherwise create new user
                    $user = new User();
                    // Search if username exists
                    $username = $externalSourceUser['username'];
                    if (in_array($username, $existingPlatformUserUsernames)) {
                        $username .= uniqid();
                    }
                    $user->setUsername($username);
                    $user->setPassword(random_bytes(10));
                    $user->setIsMailValidated(true);
                }
                // Update or set user values
                $user->setFirstName($externalSourceUser['first_name']);
                $user->setLastName($externalSourceUser['last_name']);
                $user->setMail($externalSourceUser['email']);
                if (is_null($alreadyImportedUser)) {
                    $this->userManager->createUser($user);
                    $this->externalUserManager->createExternalUser(
                        $externalSourceUser['id'],
                        $sourceName,
                        $user
                    );
                } else {
                    $this->externalUserManager->updateExternalUserDate($alreadyImportedUser);
                    $this->om->persist($user);
                }
                // If cas enabled and user doesn't exist in CAS create cas user
                if (
                    !is_null($this->casManager) &&
                    $synchronizeCas &&
                    !in_array($externalSourceUser[$casSynchronizedField], $existingCasUserIds)
                ) {
                    $this->casManager->createCasUser($externalSourceUser[$casSynchronizedField], $user);
                }
            }
            $this->om->endFlushSuite();

            $countUsers -= $curBatchSize;
            ++$cnt;
        }
        $this->log('All users have been synchronized');
        $this->om->allowForceFlush(true);
        unset($casSynchronizedFieldUcf);

        return true;
    }

    public function syncrhonizeAllGroupsForExternalSource($sourceName, $forceUnsubscribe = true)
    {
        $sourceName = $this->slugifyName($sourceName);
        // Get external source repository
        $groups = $this->externalGroupManager->getExternalGroupsBySourceSlug($sourceName);
        $this->log('Synchronizing '.count($groups).' groups for '.$sourceName);
        $this->om->allowForceFlush(false);
        foreach ($groups as $group) {
            $this->syncrhonizeGroupForExternalSource($sourceName, $group, $forceUnsubscribe);
        }
        $this
            ->om
            ->getRepository('ClarolineExternalSynchronizationBundle:ExternalGroup')
            ->deactivateGroupsForSource($sourceName);
        $this->log('All groups have been synchronized');
        $this->om->allowForceFlush(true);
    }

<<<<<<< HEAD
        return $countUsers;
=======
        return $repo->findGroups($search);
>>>>>>> 5daf605... Admin pages for importing external groups into workspace
=======
    public function syncrhonizeGroupForExternalSource($sourceName, ExternalGroup $extGroup, $forceUnsubscribe = true)
    {
        $externalSource = $this->getExternalSource($sourceName);
        $externalSourceRepo = $this->getRepositoryForExternalSource($externalSource);
        $group = $extGroup->getGroup();
        $this->log('Synchronizing group '.$group->getName());
        // Get all user ids subscribed to external source group
        $externalSourceUserIds = $externalSourceRepo->findUserIdsByGroupId($extGroup->getExternalGroupId());
        if (empty($externalSourceUserIds)) {
            $this->log('Group '.$group->getName().' has no users, abort syncing...');

            return;
        }
        $externalUsers = $this
            ->externalUserManager
            ->getExternalUsersByExternalIdsAndSourceSlug($externalSourceUserIds, $sourceName);
        // Get all external users already subscribed to group
        $subscribedUserIds = $group->getUserIds();
        // For each external user, subscribe him to group if not already subscribed
        $alreadySubscribedIds = [];

        $this->om->startFlushSuite();
        foreach ($externalUsers as $externalUser) {
            $user = $externalUser->getUser();
            if (!in_array($user->getId(), $subscribedUserIds)) {
                $user->addGroup($group);
                $this->om->persist($user);
            } else {
                $alreadySubscribedIds[] = $user->getId();
            }
        }
        if ($forceUnsubscribe) {
            $unsubscribeUserIds = array_diff($subscribedUserIds, $alreadySubscribedIds);
            $unsubscribedUsers = $this->userManager->getUsersByIds($unsubscribeUserIds);
            foreach ($unsubscribedUsers as $user) {
                $user->removeGroup($group);
                $this->om->persist($user);
            }
        }
        $this->externalGroupManager->updateExternalGroupDate($extGroup);
        $this->om->endFlushSuite();
        $this->log('Group '.$group->getName().' has been synced.');
>>>>>>> 7da0a3b... Created commands for user and group synchronization
    }

    public function saveConfig()
    {
        if (!empty($this->sourcesArray['sources'])) {
            return file_put_contents($this->syncFilePath, $this->ymlDumper->dump($this->sourcesArray, 3));
        }

        return false;
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
        $this->om->setLogger($logger);
        $this->om->activateLog();
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

    private function isPropertyConfigured($source, $filters)
    {
        $isConfigured = true;
        foreach ($filters as $filter) {
            if (!array_key_exists($filter, $source)) {
                $isConfigured = false;
                break;
            }
        }

        return $isConfigured;
    }
}
