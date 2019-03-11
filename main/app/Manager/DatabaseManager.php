<?php

namespace Claroline\AppBundle\Manager;

use Claroline\AppBundle\API\FinderProvider;
use Claroline\AppBundle\API\Options;
use Claroline\AppBundle\Persistence\ObjectManager;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Claroline\CoreBundle\Entity\DatabaseBackup;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.database_manager")
 */
class DatabaseManager
{
    use LoggableTrait;

    private $kernel;

    /**
     * @DI\InjectParams({
     *     "om"     = @DI\Inject("claroline.persistence.object_manager"),
     *     "conn"   = @DI\Inject("doctrine.dbal.default_connection"),
     *     "finder" = @DI\Inject("claroline.api.finder")
     * })
     */
    public function __construct(ObjectManager $om, $conn, FinderProvider $finder)
    {
        $this->om = $om;
        $this->conn = $conn;
        $this->finder = $finder;
    }

    public function backupRows($class, $searches)
    {
        $query = $this->finder->get($class)->find($searches, null, 0, -1, false, [Options::SQL_QUERY]);
        $table = strtolower(str_replace('\\', '_', $class));
        $name = $table.'_'.time();

        try {
            $this->log("backing up $table...");
            $this->createBackupFromQuery($name, $query->getSql());
        } catch (\Exception $e) {
            $this->log("Couldn't backup $table");
        }
    }

    public function backupTables($tables)
    {
        foreach ($tables as $table) {
            $name = $table.'_'.time();

            try {
                $this->log("backing up $table as $name...");
                $this->createBackupFromQuery($name, "SELECT * FROM $table");
            } catch (\Exception $e) {
                $this->log("Couldn't backup $table");
            }
        }
    }

    private function createBackupFromQuery($name, $query)
    {
        $this->conn->query("
            CREATE TABLE $name AS ($query)
        ");
        $dbBackup = new DatabaseBackup();
        $dbBackup->setName($name);
        $this->om->persist($dbBackup);
        $this->om->flush();
    }

    public function dropTables($tables, $backup = false)
    {
        if ($backup) {
            $this->backupTables($tables);
        }
        /*
                foreach ($tables as $table) {
                    try {
                        $this->log('DROP '.$table);
                        $sql = '
                        SET FOREIGN_KEY_CHECKS=0;
                        DROP TABLE '.$table.';
                        SET FOREIGN_KEY_CHECKS=1;
                    ';

                        $stmt = $this->conn->prepare($sql);
                        $stmt->execute();
                    } catch (\Exception $e) {
                        $this->log('Couldnt drop '.$table.' '.$e->getMessage());
                    }
                }*/
    }
}
