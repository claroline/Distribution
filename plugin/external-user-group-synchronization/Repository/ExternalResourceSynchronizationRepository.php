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

    public function findViewNames()
    {
        $views = $this->conn->getSchemaManager()->listViews();

        return empty($views) ? [] : array_keys($views);
    }

    public function findColumnNames($table)
    {
        $cols = $this->conn->getSchemaManager()->listTableColumns($table);

        return empty($cols) ? [] : array_keys($cols);
    }

    public function findUsers($max = -1, $page = -1)
    {
        $qb = $this->createUserQueryBuilder();

        if (is_null($qb)) {
            return [];
        }

        if ($max > 0) {
            $qb->setMaxResults($max)->setFirstResult($max * max(0, $page));
        }

        return $qb->execute()->fetchAll();
    }

    public function findGroups($search = null, $max = -1)
    {
        $qb = $this->createGroupQueryBuilder();

        if (is_null($qb)) {
            return [];
        }

        if (!empty($search)) {
            $qb
                ->andWhere(
                    $qb->expr()->orX(
                        $qb->expr()->like($this->config['group_config']['fields']['group_name'], ':search'),
                        $qb->expr()->like($this->config['group_config']['fields']['code'], ':search')
                    ))
                ->setParameter('search', '%'.$search.'%');
        }

        if ($max > 0) {
            $qb->setMaxResults($max);
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
        $fields = (isset($userConf['fields'])) ? $userConf['fields'] : [];

        if (empty($userConf) || empty($fields)) {
            return null;
        }

        $qb
            ->select(
                $fields['id'].' AS id',
                $fields['username'].' AS username',
                $fields['first_name'].' AS first_name',
                $fields['last_name'].' AS last_name',
                $fields['email'].' AS email',
                (empty($fields['code']) ? 'NULL' : $fields['code']).' AS code'
            )
            ->from($userConf['table']);

        return $qb;
    }

    private function createGroupQueryBuilder()
    {
        $qb = $this->conn->createQueryBuilder();
        $groupConf = (isset($this->config['group_config'])) ? $this->config['group_config'] : [];
        $fields = (isset($groupConf['fields'])) ? $groupConf['fields'] : [];

        if (empty($groupConf) || empty($fields)) {
            return null;
        }

        $qb
            ->select(
                $fields['id'].' AS id',
                $fields['group_name'].' AS name',
                (empty($fields['type']) ? 'NULL' : $fields['type']).' AS type',
                (empty($fields['code']) ? 'NULL' : $fields['code']).' AS code',
                (empty($fields['user_count']) ? 'NULL' : $fields['user_count']).' AS user_count'
            )
            ->from($groupConf['table']);

        return $qb;
    }
}
