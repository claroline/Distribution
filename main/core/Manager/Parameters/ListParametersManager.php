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

use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.manager.list_parameters_manager")
 */
class ListParametersManager
{
    public function copy($original, $copy)
    {
        $copy->setUploadDestination($original->isUploadDestination());

        // summary
        $copy->setShowSummary($original->getShowSummary());
        $copy->setOpenSummary($original->getOpenSummary());

        // list
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

        return $copy;
    }
}
