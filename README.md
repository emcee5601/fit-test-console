# Mark's Fit Test Console

The app is deployed to https://emcee5601.github.io/fit-test-console/

An older version might be deployed here: https://emcee5601.github.io/mftc-old/#/settings

# Maintainer's notes

| activity                | command                              | notes                                                                                                                           |
|-------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| run dev version locally | yarn dev                             |                                                                                                                                 |
| lint                    | yarn lint                            |                                                                                                                                 |
| bump version            | yarn version [major \|minor \|patch] | be sure to add and commit the change!                                                                                           |
| build locally           | yarn build                           |                                                                                                                                 |
| publish with gh-pages   | yarn run deploy                      | Be sure to bump version and build first. Contents of the `dist` directory are published. Modify as required prior to deploying. |


## Hack for deploying multiple versions
Caveats:
- Read this first (tl;dr: it's not recommended): https://web.dev/articles/building-multiple-pwas-on-the-same-domain
- only one version can be installed at a time since there can only be one installed PWA per subdomain
- local data is shared since it's the same subdomain, so data needs to be future and backward compatible


- use relative start_url and base path in vite.config.ts
- create empty repo in github (mftc-old)
```
$ git clone git@github.com:emcee5601/mftc-old.git
$ cd mftc-old
$ git remote add upstream git@github.com:emcee5601/fit-test-console.git
$ git pull upstream
$ #git push origin # optional, we don't need the code to be upstream since we're not using gha for deploy

# pick a version and deploy
$ git checkout <hash>
$ yarn install # 
$ yarn build
$ yarn run deploy
```
- should theoretically not have overlapping routes
- only one version can be installed at a time, so only 1 version can be run offline at a time.
- no need to push to the repo since we only need the repo for gh-pages
