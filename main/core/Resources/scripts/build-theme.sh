PWD=`pwd`
LOD=`dirname $0`
DIR="$PWD/$LOD"

LESS_DIR="$DIR/../less/themes"
ROOT_DIR="$DIR/../../../../../../.."
CSS_DIR="$ROOT_DIR/web/themes"

LESSC="$ROOT_DIR/node_modules/.bin/lessc"
POSTCSS="$ROOT_DIR/node_modules/.bin/postcss"

echo "Compiling and applying PostCSS on theme '$1'..."

set -o pipefail

$LESSC "$LESS_DIR/$1.less" | $POSTCSS \
    -u autoprefixer \
    --autoprefixer.browsers "last 2 versions" \
    -u cssnano \
    --cssnano.safe true \
    -o "$CSS_DIR/$1/bootstrap.css"
