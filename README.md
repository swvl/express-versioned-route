# Express-Versioned-Route

Simple express.js 4.x extension, to add support for versioned routes.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![codecov](https://codecov.io/gh/swvl/express-versioned-route/branch/master/graph/badge.svg)](https://codecov.io/gh/swvl/express-versioned-route)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=security_rating)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=swvl_express-versioned-route&metric=alert_status)](https://sonarcloud.io/dashboard?id=swvl_express-versioned-route)

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
- Built-in soft deprecation policy
- Case insensitive name matching
- Minimal overhead ( less than 0.15ms/request )
- Dynamic routing based on client headers
- Client can choose specific version using `accept-version` header

## installation
- Update your .npmrc file: `echo "@swvl:registry=https://npm.pkg.github.com" >> .npmrc`
- Then install the package: `npm install @swvl/express-versioned-route`

## Usage

```js
const searchVersionDef = versionsDef()({
  versions: {
    simpleSearch: ['2020-Q1', searchMW1, searchMW2, searchHandlerV1],
    dynamicSearch: [dynamicSearchMW1, dynamicSearchMW2, searchHandlerV2, 'default'],
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

#### Expected user headers

* device-os & build-number
* accept-version

[![Try it live on RunKit](https://badge.runkitcdn.com/@swvl/express-versioned-route.svg)](https://runkit.com/swvl/express-versioned-route)

## Options

Global options can be passed as 1st parameter for versionsDef function, or configured as part of versionsDef specs

#### Example
```js
const searchVersionDef = versionsDef(globalOptions)({
  versions: {
    ...
  }
  ...,
  options: {
    ...
  }
});
```

#### Supported options

<table>
<tr>
  <td> <b> prop name </b> </td>
  <td> <b> description </b> </td>
  <td> <b> default </b> </td>
</tr>
  
<tr>
  <td> onDeprecated </td>
  <td> callback  </td>
  <td>
    <pre>
(versionName, req)=> {} 
    </pre>
  </td>
</tr>

<tr>
  <td> allowClientRequestFallbackToDefaultVersion </td>
  <td> invalid client headers will fallback to default version instead of 404 </td>
  <td> true </td>
</tr>

<tr>
  <td> onClientSelection </td>
  <td> configure how client should be selected based on req </td>
  <td> 
    <pre>
onClientSelection: req => {
  return {
    name: req.headers['device-os'],
    buildNumber: req.headers['build-number'],
  };
}
    </pre>
  </td>
</tr>
</table>


## License

[Apache-2.0](<https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)>)
