#!/usr/bin/env sh
set -e
rm -rf dist
npm run build
cd dist
git init
git add .
git commit -m 'Update Github Gages'
git push -f git@github.com:nusr/excel.git master:gh-pages
cd -