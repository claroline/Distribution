<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\CoreBundle\Manager\Parameters;

use Claroline\AppBundle\Entity\Parameters\ListParameters;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.list_parameters_manager")
 */
class ListParametersManager
{
    public function copy($original, $copy)
    {
        if ($this->hasTrait($original, ListParameters::class)) {
            var_dump(get_class($original));
            $copy->setFilterable($original->isFilterable());
            $copy->setSortable($original->isSortable());
            $copy->setPaginated($original->isPaginated());
            $copy->setColumnsFilterable($original->isColumnsFilterable());
            $copy->setCount($original->hasCount());
            $copy->setActions($original->hasActions());
            $copy->setSortBy($original->getSortBy());
            $copy->setAvailableSort($original->getAvailableSort());
            $copy->setPageSize($original->getPageSize());
            $copy->setAvailablePageSizes($original->getAvailablePageSizes());
            $copy->setDisplay($original->getDisplay());
            $copy->setAvailableDisplays($original->getAvailableDisplays());
            $copy->setSearchMode($original->getSearchMode());
            $copy->setFilters($original->getFilters());
            $copy->setAvailableFilters($original->getAvailableFilters());
            $copy->setAvailableColumns($original->getAvailableColumns());
            $copy->setDisplayedColumns($original->getDisplayedColumns());
            $copy->setCard($original->getCard());
        }

        return $copy;
    }

    public function hasTrait($object, $trait)
    {
        return in_array(
        $trait,
        array_keys((new \ReflectionClass(get_class($object)))->getTraits()
      ));
    }
}
