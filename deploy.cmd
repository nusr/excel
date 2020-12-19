#!/usr/bin/env sh
set -e

cd dist

git init
git add -A
git commit -m 'Update Github Gages'

git push -f git@github.com:nusr/excel.git master:gh-pages

cd ../