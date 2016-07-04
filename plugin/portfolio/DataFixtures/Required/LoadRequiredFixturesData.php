<?php

namespace Icap\PortfolioBundle\DataFixtures\Required;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\Persistence\ObjectManager;
use Icap\PortfolioBundle\Entity\Widget\WidgetType;

class LoadRequiredFixturesData extends AbstractFixture
{
    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        /*
         * array format:
         *   - name
         *   - icon class
         */
        $widgetTypes = [
            ['userInformation', 'info'],
            ['text', 'align-left'],
            ['skills', 'bookmark'],
            ['formations', 'graduation-cap'],
            ['experience', 'briefcase'],
        ];

        foreach ($widgetTypes as $widgetType) {
            $entity = new WidgetType();
            $entity
                ->setName($widgetType[0])
                ->setIcon($widgetType[1]);

            $manager->persist($entity);
        }

        $manager->flush();
    }
}
