#!/bin/bash
regex="^(feat|design|style|fix|docs|refactor|test|chore|move): [A-Z][A-Za-z ]+(\(#[0-9]+\))?$"

if [[ ! $MESSAGE =~ $regex ]]; then
    echo 'Check your title'
    exit 1
fi