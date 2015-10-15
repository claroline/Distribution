#############################################################
# This script is a pure bash copy of .travis.yml, intended
# to debug travis builds locally. Usage:
#
# $ sh local-travis.sh some_user/some_github_repo
#
#############################################################

set -e

if [ $# -eq 0 ]
  then
    echo "Github repo slug (user/repo) must be supplied"
    exit 1
fi

git clone "http://github.com/${1}" $1
curl -O https://raw.githubusercontent.com/claroline/DevBundle/master/Resources/travis/pre-composer.php
TRAVIS_REPO_SLUG=$1 php pre-composer.php
ROOT_DIR=`pwd`
BUNDLE_DIR=`cat bundle_dir.txt`
cd $BUNDLE_DIR
COMPOSER=composer_travis.json composer update
cd $ROOT_DIR
cp -R vendor/claroline/dev-bundle/Claroline/DevBundle/Resources/travis/app/* app
php app/register-bundle.php `cat package_dir.txt`
php app/init-schema.php
vendor/bin/phpunit -c "${BUNDLE_DIR}/phpunit_travis.xml"
