<?php

namespace Innova\MediaResourceBundle\Twig;

class InnotationExtension extends \Twig_Extension
{
    public function getName()
    {
        return 'innotation_extension';
    }

    public function getFilters()
    {
        return [
            new \Twig_SimpleFilter('hmsTime', [$this, 'secondToHmsFilter']),
        ];
    }

    public function secondToHmsFilter($seconds)
    {
        $stringSec = (string) $seconds;
        $fullMilli = explode('.', $stringSec);
        $milli = array_key_exists(1, $fullMilli) ?  substr($fullMilli[1], 0, 2) : '00';
        $ms = \gmdate('i:s', $seconds);

        return $ms.':'.$milli;
    }
}
