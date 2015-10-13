<?php

/***************************************************************
 * This script appends the bundle to be tested to bundles.ini
 * (it is not there because it was the root package during the
 * execution of composer).
 **************************************************************/

require __DIR__ . '/autoload.php';

use Claroline\BundleRecorder\Detector\Detector;

// convert errors to exceptions
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

if (count($argv) < 2) {
    echo "The bundle directory must be passed as argument\n";
    exit(1);
}

$detector = new Detector();
$bundle = $detector->detectBundle($argv[1]);

$bundleFile = __DIR__ . '/config/bundle.ini';
$bundles = file_get_contents($bundleFile);
$bundles .= "\n{$bundle} = true";
file_put_contents($bundleFile, $bundles);

echo "Updated bundles.ini with target bundle:\n{$bundle}";
