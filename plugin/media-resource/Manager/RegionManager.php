<?php

namespace Innova\MediaResourceBundle\Manager;

use Doctrine\ORM\EntityManager;
use Innova\MediaResourceBundle\Entity\MediaResource;
use Innova\MediaResourceBundle\Entity\Region;
use Innova\MediaResourceBundle\Entity\HelpLink;
use Innova\MediaResourceBundle\Entity\HelpText;
use Innova\MediaResourceBundle\Entity\RegionConfig;
use JMS\DiExtraBundle\Annotation as DI;

/**
 * @DI\Service("innova_media_resource.manager.media_resource_region")
 */
class RegionManager
{
    protected $em;
    protected $regionConfigManager;

    /**
     * @DI\InjectParams({
     *      "em"                    = @DI\Inject("doctrine.orm.entity_manager"),
     *      "regionConfigManager"   = @DI\Inject("innova_media_resource.manager.media_resource_region_config")
     * })
     *
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em, RegionConfigManager $regionConfigManager)
    {
        $this->em = $em;
        $this->regionConfigManager = $regionConfigManager;
    }

    public function save(Region $region)
    {
        $this->em->persist($region);
        $this->em->flush();

        return $region;
    }

    public function findByAndOrder(MediaResource $mr)
    {
        return $this->getRepository()->findBy(['mediaResource' => $mr], ['start' => 'ASC']);
    }

    public function getRepository()
    {
        return $this->em->getRepository('InnovaMediaResourceBundle:Region');
    }

    public function copyRegion(MediaResource $mr, Region $region)
    {
        $entity = new Region();
        $entity->setMediaResource($mr);
        $regionConfig = new RegionConfig();
        $regionConfig->setRegion($entity);
        $entity->setRegionConfig($regionConfig);

        $entity->setStart($region->getStart());
        $entity->setEnd($region->getEnd());
        $entity->setNote($region->getNote());
        $entity->setUuid($region->getUuid());

        $oldRegionConfig = $region->getRegionConfig();
        $helpTexts = $oldRegionConfig->getHelpTexts();
        foreach ($helpTexts as $helpText) {
            $regionConfig->addHelpText($helpText);
        }
        $helpLinks = $oldRegionConfig->getHelpLinks();
        foreach ($helpLinks as $helpLink) {
            $regionConfig->addHelpLink($helpLink);
        }
        $regionConfig->setLoop($oldRegionConfig->hasLoop());
        $regionConfig->setRate($oldRegionConfig->hasRate());
        $regionConfig->setBackward($oldRegionConfig->hasBackward());
        $regionConfig->setHelpRegionUuid($oldRegionConfig->getHelpRegionUuid());
        $this->save($entity);
    }

    /**
     * Get regions helps from given times.
     * If some given times refers to the same region, the region will be added just once.
     */
    public function getRegionsHelpsFromTimes(MediaResource $mr, $data)
    {
        $result = [];
        //$regionConfigManager = $this->em->(innova_media_resource.manager.media_resource_region_config)
        foreach ($data as $time) {
            $region = $this->em->getRepository('InnovaMediaResourceBundle:Region')->findRegionByTime($mr, $time);
            if ($region && !array_key_exists($region->getId(), $result)) {
                $result[$region->getId()] = $this->regionConfigManager->getRegionHelps($region);
            }
        }

        return $result;
    }

    /**
     * Create/Update MediaResource regions and there config.
     *
     * @param MediaResource $mr
     * @param array of data
     */
    public function handleMediaResourceRegions(MediaResource $mr, $data)
    {
        $regions = $this->getRegionsFromData($data);

        $this->deleteUnusedRegions($mr, $regions);

        // 3 help texts and 3 help links per region ()
        $helpTextsOrLinksIndex = 0;

        // update or create région
        foreach ($regions as $region) {
            // update
            if ($region['id']) {
                $entity = $this->getRepository()->find($region['id']);
            }
            // new
            else {
                $entity = new Region();
                $entity->setMediaResource($mr);
                $regionConfig = new RegionConfig();
                $regionConfig->setRegion($entity);
                $entity->setRegionConfig($regionConfig);
            }

            $entity->setStart($region['start']);
            $entity->setEnd($region['end']);
            $entity->setNote($region['note']);
            $entity->setUuid($region['uuid']);

            $config = $entity->getRegionConfig();
            $config->setLoop($region['loop']);
            $config->setRate($region['rate']);
            $config->setBackward($region['backward']);
            $config->setHelpRegionUuid($region['help-region-uuid']);
            $helpTexts = $config->getHelpTexts();
            if (count($helpTexts) > 0) {
                $i = 0;
                foreach ($helpTexts as $helpText) {
                    $helpText->setText($region['helpTexts'][$i]);
                    ++$i;
                }
            } else {
                $i = 0;
                foreach ($region['helpTexts'] as $helpText) {
                    $help = new HelpText();
                    $help->setText($region['helpTexts'][$i]);
                    $help->setRegionConfig($config);
                    $config->addHelpText($help);
                    ++$i;
                }
            }
            $helpLinks = $config->getHelpLinks();
            if (count($helpLinks) > 0) {
                $i = 0;
                foreach ($helpLinks as $helpLink) {
                    $helpLink->setUrl($region['helpLinks'][$i]);
                    ++$i;
                }
            } else {
                $i = 0;
                foreach ($region['helpLinks'] as $helpText) {
                    $help = new HelpLink();
                    $help->setUrl($region['helpLinks'][$i]);
                    $help->setRegionConfig($config);
                    $config->addHelpLink($help);
                    ++$i;
                }
            }
            $this->save($entity);
        }

        return $mr;
    }

    /**
     * tranform an array of separated data to an array of region / region config data.
     *
     * @param array $data
     *
     * @return an array of region and region config
     */
    private function getRegionsFromData($data)
    {
        $regions = [];
        $starts = $data['start'];
        $ends = $data['end'];
        $notes = $data['note'];
        $ids = $data['region-id'];
        $uuids = $data['region-uuid'];
        $helpRegionIds = $data['help-region-uuid'];
        $loops = $data['loop'];
        $backwards = $data['backward'];
        $rates = $data['rate'];
        $texts = $data['help-texts'];
        $links = $data['help-links'];

        $nbData = count($starts);

        $helpTexts = [];
        $helpLinks = [];
        // always 3 texts / links per region ... but each one might be empty
        $nbHelpTextsOrLinks = $nbData * 3;

        // set region texts and links
        $index = 0;
        for ($i = 0; $i < $nbHelpTextsOrLinks; $i += 3) {
            $helpTexts[$index] = [$texts[$i], $texts[$i + 1], $texts[$i + 2]];
            $helpLinks[$index] = [$links[$i], $links[$i + 1], $links[$i + 2]];
            ++$index;
        }

        for ($i = 0; $i < $nbData; ++$i) {
            $regions[] = [
                'id' => $ids[$i],
                'uuid' => $uuids[$i],
                'start' => $starts[$i],
                'end' => $ends[$i],
                'note' => $notes[$i],
                'help-region-uuid' => $helpRegionIds[$i],
                'loop' => $loops[$i],
                'backward' => $backwards[$i],
                'rate' => $rates[$i],
                'helpTexts' => $helpTexts[$i],
                'helpLinks' => $helpLinks[$i],
            ];
        }

        return $regions;
    }

    /**
     * Delete unused regions.
     *
     * @param MediaResource $mr
     * @param array of regions to check
     */
    private function deleteUnusedRegions(MediaResource $mr, $toCheck)
    {
        // get existing regions in database
        $existing = $this->getRepository()->findBy(['mediaResource' => $mr]);
        // delete regions if they are no more here
        if (count($existing) > 0) {
            $toDelete = $this->checkIfRegionExists($existing, $toCheck);

            foreach ($toDelete as $unused) {
                $this->em->remove($unused);
            }
            $this->em->flush();
        }
    }

    private function checkIfRegionExists($existing, $toCheck)
    {
        $toDelete = [];
        foreach ($existing as $region) {
            $found = false;
            foreach ($toCheck as $current) {
                if ($current['id'] == $region->getId()) {
                    $found = true;
                    break;
                }
            }
            // if not found, this is an unused region
            if (!$found) {
                $toDelete[] = $region;
            }
        }

        return $toDelete;
    }
}
