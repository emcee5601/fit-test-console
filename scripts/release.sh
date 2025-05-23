#!/usr/bin/env bash -ex

# make sure we're not in an "old" version directory to prevent accidentally pushing to the old version repo
if pwd | grep -e '-old$'
then
  echo "Releasing from an old version directory is not permitted."
  exit 1
fi

# make sure we're on main
if [ "$(git branch --show-current)" != "main" ]
then
  echo Release can only be run on branch 'main'
  exit 1
fi


# make sure there are no uncommitted changes
if [ "$(git status --porcelain=1 | wc -l)" -ne 0 ]
then
  echo There are uncommitted changes.
  exit 1
fi

# bump version
yarn version patch

# build with updated version
yarn build

# extract version
VERSION=$(jq < package.json '.version' -r)

# commit version bump
git add package.json
git commit -m "bump version to ${VERSION}"

# add a tag
TAG=v${VERSION}
git tag "${TAG}"

# push changes
git push

# push the tag so versions are easier to find
git push origin "${TAG}"

# remember to deploy. (github actions now deploys when a version tag is pushed)
#echo Next step: deploy: yarn run deploy
