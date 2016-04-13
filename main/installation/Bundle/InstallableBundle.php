<?php

/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Claroline\InstallationBundle\Bundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

abstract class InstallableBundle extends Bundle implements InstallableInterface
{
    public function hasMigrations()
    {
        return true;
    }

    public function getRequiredFixturesDirectory($environment)
    {
        return;
    }

    public function getOptionalFixturesDirectory($environment)
    {
        return;
    }

    public function getAdditionalInstaller()
    {
        return;
    }
    
    public function getComposer()
    {
        static $data;

        if (!$data) {
            $ds = DIRECTORY_SEPARATOR;
            $path = realpath($this->getPath() . $ds . 'composer.json');
            //metapackage are 2 directories above
            if (!$path) $path = realpath($this->getPath() . "{$ds}..{$ds}..{$ds}composer.json");
            $data = json_decode(file_get_contents($path));
        }

        return $data;
    }

    public function getVersion()
    {
        foreach ($this->getInstalled() as $bundle) {
            if ($bundle['name'] === $this->getOrigin()) {
                return $bundle['version'];
            }
        }

        return '0.0.0.0';
    }

    public function getOrigin()
    {
        return $this->getComposerParameter('name');
    }

    public function getDescription()
    {
        return file_exists($this->getPath() . '/DESCRIPTION.md') ? file_get_contents($this->getPath() . '/DESCRIPTION.md'): '';
    }

    public function getRequirements()
    {
        return json_decode(file_get_contents($this->getPath() . '/require.json'), true);
    }

    private function getInstalled()
    {
        static $data;

        if (!$data) {
            $ds = DIRECTORY_SEPARATOR;
            $path = realpath($this->getPath().$ds.'composer.json');
            $data = json_decode(file_get_contents($path));
        }

        return $data;
    }

    private function getComposerParameter($parameter, $default = null)
    {
        $data = $this->getComposer();

        if ($data && property_exists($data, $parameter)) {
            return $data->{$parameter};
        }

        return $default;
    }
}
