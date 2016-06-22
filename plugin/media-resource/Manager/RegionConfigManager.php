<?php

namespace Innova\MediaResourceBundle\Manager;

use JMS\DiExtraBundle\Annotation as DI;
use Doctrine\ORM\EntityManager;
use Innova\MediaResourceBundle\Entity\Region;

/**
 * @DI\Service("innova_media_resource.manager.media_resource_region_config")
 */
class RegionConfigManager
{
    protected $em;

    /**
     * @DI\InjectParams({
     *      "em"                    = @DI\Inject("doctrine.orm.entity_manager")
     * })
     *
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }

    public function getRegionHelps(Region $region)
    {
        $regionHelp = $region->getRegionConfig();
        $helpTexts = $regionHelp->getHelpTexts();
        $helpLinks = $regionHelp->getHelpLinks();
        $helpRegionUuid = $regionHelp->getHelpRegionUuid();
        $texts = [];
        if (count($helpTexts) > 0) {
            foreach ($helpTexts as $helptext) {
                if ($helptext->getText() !== '') {
                    $texts[] = $helptext->getText();
                }
            }
        }

        $links = [];
        if (count($helpLinks) > 0) {
            foreach ($helpLinks as $helpLink) {
                if ($helpLink->getUrl() !== '') {
                    $links[] = $helpLink->getUrl();
                }
            }
        }
        $connex = [];
        if ($helpRegionUuid) {
            $region = $this->em->getRepository('InnovaMediaResourceBundle:Region')->findOneBy(['uuid' => $helpRegionUuid]);
            $connex = [
              'start' => $region->getStart(),
              'end' => $region->getEnd(),
            ];
        }

        $result = [
          'start' => $region->getStart(),
          'end' => $region->getEnd(),
          'loop' => $regionHelp->isLoop(),
          'backward' => $regionHelp->isBackward(),
          'rate' => $regionHelp->isRate(),
          'texts' => $texts,
          'links' => $links,
          'connex' => $connex,
        ];

        return $result;
    }
}
