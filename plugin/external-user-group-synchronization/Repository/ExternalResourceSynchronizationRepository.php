<?php
/**
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * Date: 5/9/17
 */

namespace Claroline\ExternalSynchronizationBundle\Repository;

use Doctrine\DBAL\DriverManager;

class ExternalResourceSynchronizationRepository
{
    /** @var \Doctrine\DBAL\Connection */
    private $conn;

    private $config;
    public function __construct($config)
    {
        $this->config = $config;
        $this->initializeConnection();
    }

    public function findTableNames()
    {
        return $this->conn->getSchemaManager()->listTableNames();
    }

    public function findColumnNames($table)
    {
        $cols = $this->conn->getSchemaManager()->listTableColumns($table);

        return empty($cols) ? [] : array_keys($cols);
    }

    public function findUsers($limit = -1, $page = -1)
    {
        $qb = $this->createUserQueryBuilder();

        if (is_null($qb)) {
            return [];
        }

        if ($limit > 0) {
            $qb->setMaxResults($limit)->setFirstResult($limit * max(0, $page));
        }

        return $qb->execute()->fetchAll();
    }

    public function findGroups($search = null, $limit = -1)
    {
        $qb = $this->createGroupQueryBuilder();

        if (is_null($qb)) {
            return [];
        }

        if (!empty($search)) {
            $qb
                ->andWhere($qb->expr()->like($this->config['group_config']['name'], '?'))
                ->setParameter(0, '%'.$search.'%');
        }

        if ($limit > 0) {
            $qb->setMaxResults($limit);
        }

        return $qb->execute()->fetchAll();
    }

    private function initializeConnection()
    {
        $connectionParams = array_intersect_key($this->config, [
            'host' => null,
            'port' => null,
            'dbname' => null,
            'driver' => null,
            'user' => null,
            'password' => null,
        ]);
        $this->conn = DriverManager::getConnection($connectionParams);
    }

    private function createUserQueryBuilder()
    {
        $qb = $this->conn->createQueryBuilder();
        $userConf = (isset($this->config['user_config'])) ? $this->config['user_config'] : [];

        if (empty($userConf)) {
            return null;
        }
        $qb
            ->select(
                $userConf['id'].' AS id',
                $userConf['username'].' AS username',
                $userConf['first_name'].' AS first_name',
                $userConf['last_name'].' AS last_name',
                $userConf['email'].' AS email',
                (empty($userConf['code']) ? 'NULL' : $userConf['code']).' AS code'
            )
            ->from($userConf['table']);

        return $qb;
    }

    private function createGroupQueryBuilder()
    {
        $qb = $this->conn->createQueryBuilder();
        $groupConf = (isset($this->config['group_config'])) ? $this->config['group_config'] : [];
        if (empty($groupConf)) {
            return null;
        }
        $qb
            ->select(
                $groupConf['id'].' AS id',
                $groupConf['name'].' AS name',
                (empty($groupConf['type']) ? 'NULL' : $groupConf['type']).' AS type',
                (empty($groupConf['user_count']) ? 'NULL' : $groupConf['user_count']).' AS user_count'
            )
            ->from($groupConf['table']);

        return $qb;
    }
}
