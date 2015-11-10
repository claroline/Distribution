<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\DevBundle\Manager;

use JMS\DiExtraBundle\Annotation as DI;
use Claroline\BundleRecorder\Log\LoggableTrait;
use Psr\Log\LoggerInterface;
use Symfony\Component\Yaml\Yaml;

/**
 * @DI\Service("claroline.dev_manager.translation_manager")
 */
class TranslationManager
{
    use LoggableTrait;

    public function fill($mainFile, $filledFile)
    {
        $this->log("Filling the translation file {$filledFile}");
        $mainTranslations = Yaml::parse($mainFile);
        $translations = Yaml::parse($filledFile);
        if (!$translations) $translations = array();

        //add missing keys
        foreach (array_keys($mainTranslations) as $requiredKey) {
            if (!array_key_exists($requiredKey, $translations)) {
                $translations[$requiredKey] = $requiredKey;
            }
        }

        //removing superfluous keys
        foreach ($translations as $key => $value) {
            if (!array_key_exists($key, $mainTranslations)) unset($translations[$key]);
        }

        ksort($translations);
        $yaml = Yaml::dump($translations);
        file_put_contents($filledFile, $yaml);
    }

    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
