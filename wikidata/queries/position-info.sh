#!/bin/bash

RESULTS=$(mktemp)

qsv cat rows wikidata/*positions.csv | qsv select position | qsv dedup | qsv behead | xargs wd sparql wikidata/templates/position-info.js -f csv > $RESULTS
sed -e 's#http://www.wikidata.org/entity/##g' -e 's/T00:00:00Z//g' -e 's|http://www.wikidata.org/.well-known/genid/[[:alnum:]]*|<noval>|g' $RESULTS > wikidata/results/position-info.csv
