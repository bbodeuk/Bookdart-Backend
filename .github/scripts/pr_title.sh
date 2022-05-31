#!/bin/bash
type='^(feat|design|style|fix|docs|refactor|test|chore|move): '
capital='[A-Z]'
subject=$'[ ~`!@#$%&*()_+=\\{}|;\':",.\/<>?[-^a-zA-Z0-9-]+$'
convention="$type$capital$subject"

if [[ ${#MESSAGE} -gt 50 ]]; then
    echo 'Title is too long. Make it up to 50 characters.'
    exit 1
fi


if [[ ! $MESSAGE =~ $convention ]]; then
    if [[ ! $MESSAGE =~ $type ]]; then
        echo 'Unexpected type'
        exit 11
    fi

    if [[ ! $MESSAGE =~ $type$capital ]]; then
        echo 'Must start with a capital letter'
        exit 12
    fi

    echo 'Unexpected character(s) in subject'
    exit 13
fi