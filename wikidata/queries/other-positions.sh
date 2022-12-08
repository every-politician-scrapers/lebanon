#!/bin/bash

RESULTS=$(mktemp)
CLEANED=$(mktemp)

qsv select id html/bio.csv | qsv search -v "(Q9682|Q43274)" | qsv dedup | qsv behead | xargs wd sparql wikidata/templates/other-positions.js -f csv > $RESULTS
sed -e 's#http://www.wikidata.org/entity/##g' -e 's/T00:00:00Z//g' -e 's|http://www.wikidata.org/.well-known/genid/[[:alnum:]]*|<noval>|' $RESULTS > $CLEANED
qsv join --left-anti position $CLEANED position <(qsv cat rows wikidata/*positions.csv) | sed -r 's/([0-9]+)$/Q\1/g' > wikidata/results/other-positions.csv
