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

    /**
     * retrieve helps for an array of region.
     */
    public function getHelpsFromRegions($regions)
    {
        $helps = [];
        foreach ($regions as $region) {
            $help = $this->getRegionHelps($region);
            $helps[] = $help;
        }

        return $helps;
    }

    /**
     * retrieve helps for one region.
     */
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
            $helpR = $this->em->getRepository('InnovaMediaResourceBundle:Region')->findOneBy(['uuid' => $helpRegionUuid]);
            $connex = [
              'start' => $helpR->getStart(),
              'end' => $helpR->getEnd(),
            ];
        }

        $hasHelp = $regionHelp->isLoop() === 1 || $regionHelp->isBackward() === 1 || $regionHelp->isRate() === 1 || count($texts) > 0 || count($links) > 0 || count($connex) > 0;

        $previousRegion = $this->em->getRepository('InnovaMediaResourceBundle:Region')->findOneBy(['end' => $region->getStart()]);
        $previous = [];
        if ($previousRegion) {
            $prevRegionHelp = $previousRegion->getRegionConfig();
            $prevHelpTexts = $prevRegionHelp->getHelpTexts();
            $prevHelpLinks = $prevRegionHelp->getHelpLinks();
            $prevHelpRegionUuid = $prevRegionHelp->getHelpRegionUuid();
            $prevTexts = [];
            if (count($prevHelpTexts) > 0) {
                foreach ($prevHelpTexts as $helptext) {
                    if ($helptext->getText() !== '') {
                        $prevTexts[] = $helptext->getText();
                    }
                }
            }

            $prevLinks = [];
            if (count($prevHelpLinks) > 0) {
                foreach ($prevHelpLinks as $helpLink) {
                    if ($helpLink->getUrl() !== '') {
                        $prevLinks[] = $helpLink->getUrl();
                    }
                }
            }
            $prevConnex = [];
            if ($prevHelpRegionUuid) {
                $prevHelpR = $this->em->getRepository('InnovaMediaResourceBundle:Region')->findOneBy(['uuid' => $prevHelpRegionUuid]);
                $prevConnex = [
                  'start' => $prevHelpR->getStart(),
                  'end' => $prevHelpR->getEnd(),
                ];
            }

            $prevHasHelp = $prevRegionHelp->isLoop() === 1 || $prevRegionHelp->isBackward() === 1 || $prevRegionHelp->isRate() === 1 || count($prevTexts) > 0 || count($prevLinks) > 0 || count($prevConnex) > 0;
            $previous = [
              'id' => $previousRegion->getId(),
              'start' => $previousRegion->getStart(),
              'end' => $previousRegion->getEnd(),
              'note' => $previousRegion->getNote(),
              'loop' => $prevRegionHelp->isLoop(),
              'backward' => $prevRegionHelp->isBackward(),
              'rate' => $prevRegionHelp->isRate(),
              'texts' => $prevTexts,
              'links' => $prevLinks,
              'connex' => $prevConnex,
              'hasHelp' => $prevHasHelp,
            ];
        }
        $result = [
          'id' => $region->getId(),
          'start' => $region->getStart(),
          'end' => $region->getEnd(),
          'note' => $region->getNote(),
          'loop' => $regionHelp->isLoop(),
          'backward' => $regionHelp->isBackward(),
          'rate' => $regionHelp->isRate(),
          'texts' => $texts,
          'links' => $links,
          'connex' => $connex,
          'hasHelp' => $hasHelp,
          'previous' => $previous,
        ];

        return $result;
    }
}
