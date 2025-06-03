# Mark's Fit Test Console

This app is deployed to https://emcee5601.github.io/fit-test-console/ whenever a version tag is created.

Older versions deploy here nightly: https://emcee5601.github.io/mftc-old/ ([source](https://github.com/emcee5601/mftc-old))



# Maintainer's notes

| activity                | command                                | notes                                                                              |
|-------------------------|----------------------------------------|------------------------------------------------------------------------------------|
| run dev version locally | yarn dev                               |                                                                                    |
| lint                    | yarn lint                              |                                                                                    |
| build locally           | yarn build                             |                                                                                    |
| test                    | yarn test                              |                                                                                    |
| release                 | yarn release [major \| minor \| patch] | bump version, tag, push changes (github action will deploy)                        |
| bump version            | yarn version [major \| minor \| patch] | be sure to add and commit the change!                                              |
| publish with gh-pages   | yarn run deploy                        | Deploys whatever is in './dist' to Pages. Be sure to bump version and build first. |

