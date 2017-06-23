# compare last commit of distribution repo
if [ -f 'VERSION.txt' ]; then
   LAST_COMMIT=`cat VERSION.txt | sed -n 2p`
else
   LAST_COMMIT='none'
fi

CURRENT_COMMIT=`git rev-parse HEAD`

#get the commit list
LOGS=`git log ${LAST_COMMIT}..${CURRENT_COMMIT} --oneline`

COMMITS="$( cut -d " " -f -1 <<< "$LOGS" )"
COMMITNAMES="$( cut -d " " -f 2- <<< "$LOGS" )"

COMMITS=$(tr " " "\n" <<< "$COMMITS")
mapfile -t COMMITNAMES <<< "$COMMITNAMES"

COMMITSTRING=''
MERGESTRING=''

i=0

for COMMIT in $COMMITS
do
    if [[ ${COMMITNAMES[$i]} == *"Merge"* ]]; then
      MERGESTRING="${MERGESTRING}\nclaroline/distribution@${COMMIT} - ${COMMITNAMES[$i]}"
    else
      COMMITSTRING="${COMMITSTRING}\nclaroline/distribution@${COMMIT} - ${COMMITNAMES[$i]}"
    fi
    i=$((i + 1))
done
