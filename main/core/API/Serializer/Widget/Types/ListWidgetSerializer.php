<?php

namespace Claroline\CoreBundle\API\Serializer;

use Claroline\CoreBundle\Entity\Widget\Type\ListWidget;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("claroline.serializer.widget_list")
 * @DI\Tag("claroline.serializer")
 */
class ListWidgetSerializer
{
    public function getClass()
    {
        return 'Claroline\CoreBundle\Entity\Widget\Types\ListWidget';
    }

    public function serialize(ListWidget $widget, array $options = [])
    {
        return [
            //'fetchUrl' => $widget->getFetchUrl(),
            'filterable' => $widget->isFilterable(),
            'sortable' => $widget->isSortable(),
            'paginated' => $widget->isPaginated(),
            'pageSize' => $widget->getPageSize(),
            'defaultFilters' => $widget->getDefaultFilters(),
            'availableColumns' => $widget->getAvailableColumns(),
        ];
    }

    public function deserialize($data, ListWidget $widget, array $options = [])
    {

        return $widget;
    }
}
