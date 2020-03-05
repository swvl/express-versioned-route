# Express-Versioned-Route

Simple express.js 4.x extension, to add support for versioned routes.

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=security_rating)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=alert_status)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![GitHub issues](https://img.shields.io/github/issues/swvl/express-versioned-route.svg)](https://GitHub.com/swvl/express-versioned-route/issues/)
[![GitHub issues-closed](https://img.shields.io/github/issues-closed/swvl/express-versioned-route.svg)](https://GitHub.com/swvl/express-versioned-route/issues?q=is%3Aissue+is%3Aclosed)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=sqale_index)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=bugs)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=code_smells)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=ncloc)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)

## Highlights

- Versioning the same route
- Loading time validation
- Custom middlewares for each version
- ~~Built-in soft deprecation policy~~ (to be added soon)
- Case insensitive name matching
- Minimal overhead ( less than 0.15ms/request )
- Dynamic routing based on client headers
- Client can choose the version using `accept-version` header

## Install

`npm install @swvl/express-versioned-route`

## Usage

```
const searchVersionDef = versionsDef({
  versions: {
    simpleSearch: ['2020-Q1', searchMW1, searchMW2, searchHandlerV1],
    dynamicSearch: [dynamicSearchMW1, dynamicSearchMW2, searchHandlerV2],
    superSearch: [searchHandlerV3],
    deepSearch: [searchHandlerV4],
  },
  Android: [
    [400, 'simpleSearch'],
    [450, 'dynamicSearch'],
    [500, 'superSearch'],
  ],
  iOS: [
    [400, 'simpleSearch'],
    [460, 'dynamicSearch'],
  ],
});

app.get('/search', mw1, mw2, searchVersionDef);
```

## License

[Apache-2.0](<https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)>)
