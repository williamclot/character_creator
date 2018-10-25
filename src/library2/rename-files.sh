#!/bin/bash

for old in ./*; do
    new=$(echo $old | sed -e 's/\.json$/\.js/')
    mv "$old" "$new"
done
