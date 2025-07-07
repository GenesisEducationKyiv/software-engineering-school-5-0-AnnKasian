/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "entities-independence",
      severity: "error",
      comment:
        "Entities should not depend on repositories, services, or controllers",
      from: { path: "src/.+/.*\\.entity\\.(ts|js)$" },
      to: {
        path: "src/.+/.*(repository|service|controller|provider|mapper)\\.(ts|js)$",
        pathNot: "src/.+/.*\\.entity\\.(ts|js)$",
      },
    },
    {
      name: "repositories-no-upper-layers",
      severity: "error",
      comment: "Repositories should not depend on services or controllers",
      from: { path: "src/.+/.*\\.repository\\.(ts|js)$" },
      to: { path: "src/.+/.*(service|controller)\\.(ts|js)$" },
    },
    {
      name: "services-no-controllers",
      severity: "error",
      comment: "Services should not depend on controllers",
      from: { path: "src/.+/.*\\.service\\.(ts|js)$" },
      to: { path: "src/.+/.*\\.controller\\.(ts|js)$" },
    },
    {
      name: "controllers-no-direct-coupling",
      severity: "warn",
      comment: "Controllers should communicate through services, not directly",
      from: { path: "src/.+/.*\\.controller\\.(ts|js)$" },
      to: { path: "src/.+/.*\\.controller\\.(ts|js)$" },
    },
    {
      name: "cross-module-through-interfaces",
      severity: "error",
      comment:
        "Cross-module dependencies should use interfaces, not direct implementation",
      from: { path: "src/modules/subscription/" },
      to: {
        path: "src/modules/weather/.*(repository)\\.(ts|js)$",
        pathNot: "src/modules/weather/interfaces/",
      },
    },
    {
      name: "cross-module-through-interfaces-reverse",
      severity: "error",
      comment:
        "Cross-module dependencies should use interfaces, not direct implementation",
      from: { path: "src/modules/weather/" },
      to: {
        path: "src/modules/subscription/.*(service|repository|controller)\\.(ts|js)$",
        pathNot: "src/modules/subscription/interfaces/",
      },
    },
    {
      name: "no-db-in-services",
      severity: "error",
      comment: "Services should not directly import database modules",
      from: { path: "src/.+/.*\\.service\\.(ts|js)$" },
      to: { path: "src/db/" },
    },
    {
      name: "external-apis-via-providers",
      severity: "error",
      comment: "Only providers should make external API calls",
      from: {
        path: "src/",
        pathNot: "src/.+/.*\\.provider\\.(ts|js)$",
      },
      to: {
        path: "node_modules/(axios|node-fetch|got|superagent)/",
      },
    },
    {
      name: "no-swagger-in-business-logic",
      severity: "error",
      comment: "Swagger documentation should not be imported by business logic",
      from: { path: "src/.+/.*(entity|repository|service)\\.(ts|js)$" },
      to: { path: "src/.+/swagger-docs/" },
    },
    {
      name: "no-orphans",
      comment:
        "This is an orphan module - it's likely not used (anymore?). Either use it or " +
        "remove it. If it's logical this module is an orphan (i.e. it's a config file), " +
        "add an exception for it in your dependency-cruiser configuration.",
      severity: "warn",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)[.][^/]+[.](?:js|cjs|mjs|ts|cts|mts|json)$",
          "[.]d[.]ts$",
          "(^|/)tsconfig[.]json$",
          "(^|/)(?:babel|webpack)[.]config[.](?:js|cjs|mjs|ts|cts|mts|json)$",
          "src/db/migrations/.*[.]ts$",
          "src/db/seeds/.*[.]ts$",
          "src/db/index[.]ts$",
        ],
      },
      to: {},
    },
    {
      name: "no-deprecated-core",
      comment:
        "A module depends on a node core module that has been deprecated. Find an alternative.",
      severity: "warn",
      from: {},
      to: {
        dependencyTypes: ["core"],
        path: ["^punycode$", "^domain$", "^constants$", "^sys$"],
      },
    },
    {
      name: "not-to-deprecated",
      comment:
        "This module uses a (version of an) npm module that has been deprecated. Either upgrade to a later " +
        "version of that module, or find an alternative.",
      severity: "warn",
      from: {},
      to: {
        dependencyTypes: ["deprecated"],
      },
    },
    {
      name: "no-non-package-json",
      severity: "error",
      comment:
        "This module depends on an npm package that isn't in the 'dependencies' section of your package.json.",
      from: {},
      to: {
        dependencyTypes: ["npm-no-pkg", "npm-unknown"],
      },
    },
    {
      name: "not-to-unresolvable",
      comment:
        "This module depends on a module that cannot be found ('resolved to disk'). If it's an npm " +
        "module: add it to your package.json.",
      severity: "error",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: "no-duplicate-dep-types",
      comment:
        "This module depends on an external ('npm') package that occurs more than once " +
        "in your package.json i.e. both as a devDependencies and in dependencies.",
      severity: "warn",
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ["type-only"],
      },
    },
    {
      name: "not-to-spec",
      comment:
        "This module depends on a spec (test) file. The sole responsibility of a spec file is to test code.",
      severity: "error",
      from: {},
      to: {
        path: "[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$",
      },
    },
    {
      name: "not-to-dev-dep",
      severity: "error",
      comment:
        "This module depends on an npm package from the 'devDependencies' section of your " +
        "package.json. It looks like something that ships to production, though.",
      from: {
        path: "^(src)",
        pathNot: "[.](?:spec|test)[.](?:js|mjs|cjs|jsx|ts|mts|cts|tsx)$",
      },
      to: {
        dependencyTypes: ["npm-dev"],
        dependencyTypesNot: ["type-only"],
        pathNot: ["node_modules/@types/"],
      },
    },
  ],
  options: {
    includeOnly: "^src",
    exclude: {
      path: "\\.(test|spec)\\.(js|ts)$",
    },
    tsPreCompilationDeps: true,
    moduleSystems: ["cjs", "es6"],
    externalModuleResolutionStrategy: "node_modules",
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
        theme: {
          replace: false,
          graph: { bgcolor: "white" },
          modules: [
            {
              criteria: { source: "src/.+/.*\\.entity\\.(ts|js)$" },
              attributes: { color: "blue", shape: "box" },
            },
            {
              criteria: { source: "src/.+/.*\\.repository\\.(ts|js)$" },
              attributes: { color: "green", shape: "box" },
            },
            {
              criteria: { source: "src/.+/.*\\.service\\.(ts|js)$" },
              attributes: { color: "orange", shape: "box" },
            },
            {
              criteria: { source: "src/.+/.*\\.controller\\.(ts|js)$" },
              attributes: { color: "red", shape: "box" },
            },
            {
              criteria: { source: "src/.+/.*\\.provider\\.(ts|js)$" },
              attributes: { color: "purple", shape: "box" },
            },
          ],
        },
      },
    },
  },
};
