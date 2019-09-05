<?php

namespace Claroline\CoreBundle\API\Serializer\Widget\Type;

use Claroline\AppBundle\API\Serializer\SerializerTrait;
use Claroline\CoreBundle\Entity\Widget\Type\ProgressionWidget;

class ProgressionWidgetSerializer
{
    use SerializerTrait;

    public function getClass()
    {
        return ProgressionWidget::class;
    }

    public function serialize(ProgressionWidget $widget, array $options = []): array
    {
        return [
            'levelMax' => $widget->getLevelMax(),
        ];
    }

    public function deserialize($data, ProgressionWidget $widget, array $options = []): ProgressionWidget
    {
        $this->sipe('levelMax', 'setlevelMax', $data, $widget);

        return $widget;
    }
}
