<?php

/***************************************************************
 * This script sets up the first part of a minimal testing
 * environment for Claroline bundles on travis-ci.
 *
 * It is intended to be launched from the travis configuration
 * file immediately after the sources of the repository have
 * been cloned (e.g. in a "before_script" step), and before
 * the execution of composer.
 *
 * Note that in order to work properly, this script MUST be
 * located in the root directory of the travis build.
 **************************************************************/

// convert errors to exceptions
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// directory from which the build was started
$rootDir = __DIR__;

// slug of the bundle on github (i.e. "user/repo_name")
$bundleSlug = getenv('TRAVIS_REPO_SLUG');

// directory where repository sources were cloned
$srcDir = "{$rootDir}/$bundleSlug";

// original composer.json of the bundle
$originalComposer = "{$srcDir}/composer.json";


// 1) Extract metadata from the bundle's composer file
// ---------------------------------------------------

if (!file_exists($originalComposer)) {
    echo "No composer.json found in {$srcDir}\n";
    exit(1);
}

$composerData = json_decode(file_get_contents($originalComposer));
$packageName = $composerData->name;
$packageTargetDir = isset($composerData->{'target-dir'}) ?
    $composerData->{'target-dir'} :
    '';
$packageDir = "{$rootDir}/vendor/{$packageName}";
$newSrcDir = "{$packageDir}/{$packageTargetDir}";


// 2) create a basic app structure, moving sources to usual "vendor" dir
// ---------------------------------------------------------------------

mkdir("{$rootDir}/app/config", 0777, true);
mkdir("{$newSrcDir}", 0777, true);
rename($srcDir, $newSrcDir);


// 3) create an alternate composer.json
// ------------------------------------

// project uses a lot of dev-master packages; composer will
// failed if dev packages aren't allowed
$composerData->{'minimum-stability'} = 'dev';
$composerData->{'prefer-stable'} = true;

if (!isset($composerData->config)) {
    $composerData->config = new stdClass();
}

// composer will be launched *inside* the bundle directory,
// so we must adjust the vendor path for composer
$composerData->config->{'vendor-dir'} = "{$rootDir}/vendor";

if (!isset($composerData->scripts)) {
    $composerData->scripts = new \stdClass();
}

if (!isset($composerData->scripts->{'post-install-cmd'})) {
    $composerData->scripts->{'post-install-cmd'} = [];
}

if (!isset($composerData->scripts->{'post-update-cmd'})) {
    $composerData->scripts->{'post-update-cmd'} = [];
}

// bundles.ini must be built as usual at the end of composer install
$composerData->scripts->{'post-install-cmd'}[] =
    'Claroline\\BundleRecorder\\ScriptHandler::buildBundleFile';
$composerData->scripts->{'post-update-cmd'}[] =
    'Claroline\\BundleRecorder\\ScriptHandler::buildBundleFile';

$content = json_encode($composerData, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES);
$newComposer = "{$newSrcDir}/composer_travis.json";
file_put_contents($newComposer, $content);

echo "Created {$newComposer} with content:\n{$content}\n";


// 4) creates an alternate phpunit.xml
// -----------------------------------

$originalPhpUnit = "{$newSrcDir}/phpunit.xml";

if (!file_exists($originalPhpUnit)) {
    echo "No phpunit.xml found in {$bundleSlug}\n";
    exit(1);
}

$phpUnitDoc = new DOMDocument();
$phpUnitDoc->load($originalPhpUnit);

// make sure the test suite will be bootstrapped using the
// correct auto loader (see below)
$phpUnitDoc->documentElement->setAttribute(
    'bootstrap',
    "{$rootDir}/app/autoload.php"
);

$phpTags = $phpUnitDoc->getElementsByTagName('php');

if ($phpTags->length === 0) {
    $phpTag = $phpUnitDoc->createElement('php');
    $phpUnitDoc->documentElement->appendChild($phpTag);
} else {
    $phpTag = $phpTags->item(0);
}

$serverTags = $phpTag->getElementsByTagName('server');

if ($serverTags->length === 0) {
    $serverTag = $phpUnitDoc->createElement('server');
    $phpTag->appendChild($serverTag);
} else {
    $serverTag = $serverTags->item(0);
}

// make sure the kernel environment variable is set and
// points to the right directory
$serverTag->setAttribute('name', 'KERNEL_DIR');
$serverTag->setAttribute('value', "{$rootDir}/app/");

$newPhpUnit = "{$newSrcDir}/phpunit_travis.xml";
$phpUnitDoc->save($newPhpUnit);
$content = $phpUnitDoc->saveXml();

echo "Created {$newPhpUnit} with content:\n{$content}\n";


// 5) Save a reference to the bundle new location
// ----------------------------------------------

// setting environment variables from scripts doesn't seem to work,
// so we save references in files instead
file_put_contents("{$rootDir}/package_dir.txt", $packageDir);
file_put_contents("{$rootDir}/bundle_dir.txt", $newSrcDir);
