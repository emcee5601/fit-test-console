# Mark's Fit Test Console

This app is deployed to https://emcee5601.github.io/fit-test-console/

An older version might be deployed here: https://emcee5601.github.io/mftc-old/#/settings
See https://github.com/emcee5601/mftc-old for instructions on how to deploy your own instance.


# Maintainer's notes

| activity                | command                              | notes                                                                              |
|-------------------------|--------------------------------------|------------------------------------------------------------------------------------|
| run dev version locally | yarn dev                             |                                                                                    |
| lint                    | yarn lint                            |                                                                                    |
| build locally           | yarn build                           |                                                                                    |
| test                    | yarn test                            |                                                                                    |
| release                 | yarn run release                     | bump version, tag, push changes (github action will deploy)                        |
| bump version            | yarn version [major \|minor \|patch] | be sure to add and commit the change!                                              |
| publish with gh-pages   | yarn run deploy                      | Deploys whatever is in './dist' to Pages. Be sure to bump version and build first. |

## Hack for deploying multiple versions
see https://github.com/emcee5601/mftc-old/blob/main/.github/workflows/deploy-mftc-action.yaml

Caveats:
- Read this first (tl;dr: it's not recommended): https://web.dev/articles/building-multiple-pwas-on-the-same-domain
- only one version can be installed at a time since there can only be one installed PWA per subdomain
- local data is shared since it's the same subdomain, so data needs to be future and backward compatible
- only works for mftc v1.4.2 and later because it needs relative paths, which should theoretically ensure no overlapping paths
