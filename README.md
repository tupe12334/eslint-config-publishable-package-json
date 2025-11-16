# eslint-config-publishable-package-json

> Validate your package.json files to ensure they're ready for npm publication

[![npm version](https://badge.fury.io/js/eslint-config-publishable-package-json.svg)](https://www.npmjs.com/package/eslint-config-publishable-package-json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive validation tool and ESLint configuration for ensuring your package.json contains all the required and recommended fields for publishing to npm. Catch missing or malformed package.json fields before publishing!

## Features

- ✅ Validates all **required fields** for npm publishing
- ⚠️ Warns about missing **recommended fields** for better package discoverability
- 🔍 Validates field structure and types (repository, bugs, engines, etc.)
- 🚀 Works as both a standalone validator and ESLint config
- 📦 TypeScript support with full type definitions
- 🎯 Zero dependencies (dev dependencies only)

## Installation

```bash
npm install --save-dev eslint-config-publishable-package-json
```

or with pnpm:

```bash
pnpm add -D eslint-config-publishable-package-json
```

or with yarn:

```bash
yarn add --dev eslint-config-publishable-package-json
```

## Usage

### As a Validation Function

Use the validator programmatically to check your package.json:

```typescript
import validatePackageJson from 'eslint-config-publishable-package-json/validate'
import packageJson from './package.json'

const result = validatePackageJson(packageJson)

if (!result.valid) {
  console.error('Package.json validation failed!')
  console.error('Errors:', result.errors)
  process.exit(1)
}

if (result.warnings.length > 0) {
  console.warn('Warnings:', result.warnings)
}

console.log('Package.json is valid!')
```

### As an ESLint Config

Add to your ESLint configuration:

```javascript
// eslint.config.js
import publishablePackageJson from 'eslint-config-publishable-package-json'

export default [
  publishablePackageJson,
  // ... your other configs
]
```

## Validation Rules

### Required Fields

These fields **must** be present in your package.json for publishing:

- `name` - Package name
- `version` - Package version (semver)
- `description` - Package description
- `main` - Entry point for the package
- `types` - TypeScript type definitions entry point
- `files` - Array of files to include in the published package
- `keywords` - Array of keywords for npm search
- `author` - Package author
- `license` - License identifier (e.g., "MIT", "ISC")
- `publishConfig` - npm publish configuration (e.g., `{ "access": "public" }`)

### Recommended Fields (Warnings)

These fields are highly recommended for better package discoverability and user experience:

- `repository` - Source code repository information
- `bugs` - Bug tracker URL
- `homepage` - Package homepage URL
- `engines` - Node.js version compatibility

### Field Structure Validation

The validator also checks that fields have the correct structure:

#### `repository`

Must be either a string or an object with `type` and `url`:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/user/repo.git"
  }
}
```

or shorthand:

```json
{
  "repository": "github:user/repo"
}
```

#### `bugs`

Must be either a string or an object with a `url` property:

```json
{
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  }
}
```

or shorthand:

```json
{
  "bugs": "https://github.com/user/repo/issues"
}
```

#### `homepage`

Must be a string:

```json
{
  "homepage": "https://github.com/user/repo#readme"
}
```

#### `engines`

Must be an object. The `node` field is recommended:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Validation Result

The `validatePackageJson` function returns an object with the following structure:

```typescript
interface ValidationResult {
  valid: boolean // true if no errors (warnings don't affect validity)
  errors: string[] // Array of error messages for missing/invalid required fields
  warnings: string[] // Array of warning messages for missing recommended fields
}
```

## Example

### Valid Package.json

```json
{
  "name": "@myorg/awesome-package",
  "version": "1.0.0",
  "description": "An awesome package that does amazing things",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "keywords": ["awesome", "package", "npm"],
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/myorg/awesome-package.git"
  },
  "bugs": {
    "url": "https://github.com/myorg/awesome-package/issues"
  },
  "homepage": "https://github.com/myorg/awesome-package#readme",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Common Validation Errors

```typescript
// Missing required fields
{
  valid: false,
  errors: [
    'Missing required field: description',
    'Missing required field: keywords',
    'Missing publishConfig field'
  ],
  warnings: []
}

// Invalid field structure
{
  valid: false,
  errors: [
    'repository.url is required',
    'bugs.url is required when bugs is an object',
    'engines must be an object'
  ],
  warnings: []
}

// Missing recommended fields (still valid!)
{
  valid: true,
  errors: [],
  warnings: [
    'Missing recommended field: repository',
    'Missing recommended field: bugs',
    'Missing recommended field: homepage',
    'Missing recommended field: engines'
  ]
}
```

## Use Cases

### Pre-publish Validation

Add a validation script to your package.json:

```json
{
  "scripts": {
    "validate-pkg": "node -e \"import('./validate-pkg.js')\"",
    "prepublishOnly": "npm run validate-pkg"
  }
}
```

Create `validate-pkg.js`:

```javascript
import validatePackageJson from 'eslint-config-publishable-package-json/validate'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))
const result = validatePackageJson(pkg)

if (!result.valid) {
  console.error('❌ Package.json validation failed!')
  result.errors.forEach(error => console.error(`  - ${error}`))
  process.exit(1)
}

if (result.warnings.length > 0) {
  console.warn('⚠️  Package.json warnings:')
  result.warnings.forEach(warning => console.warn(`  - ${warning}`))
}

console.log('✅ Package.json is valid!')
```

### CI/CD Integration

Use in your GitHub Actions or other CI pipelines to ensure package quality:

```yaml
- name: Validate package.json
  run: npm run validate-pkg
```

### Monorepo Package Validation

Validate all packages in a monorepo:

```javascript
import { glob } from 'glob'
import { readFileSync } from 'fs'
import validatePackageJson from 'eslint-config-publishable-package-json/validate'

const packageJsonFiles = glob.sync('packages/*/package.json')

for (const file of packageJsonFiles) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'))
  const result = validatePackageJson(pkg)

  console.log(`\nValidating ${file}:`)

  if (!result.valid) {
    console.error('❌ Failed')
    result.errors.forEach(error => console.error(`  - ${error}`))
  } else {
    console.log('✅ Passed')
  }

  if (result.warnings.length > 0) {
    result.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`))
  }
}
```

## API

### `validatePackageJson(packageJson: Record<string, unknown>): ValidationResult`

Validates a package.json object and returns validation results.

**Parameters:**

- `packageJson` - The parsed package.json object to validate

**Returns:** `ValidationResult` object with:

- `valid` - Boolean indicating if all required fields are present and valid
- `errors` - Array of error messages
- `warnings` - Array of warning messages

## Requirements

- Node.js >= 18.0.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build the package
pnpm build

# Lint code
pnpm lint

# Format code
pnpm format
```

## License

MIT © [tupe12334](https://github.com/tupe12334)

## Links

- [npm package](https://www.npmjs.com/package/eslint-config-publishable-package-json)
- [GitHub repository](https://github.com/tupe12334/eslint-config-publishable-package-json)
- [Issue tracker](https://github.com/tupe12334/eslint-config-publishable-package-json/issues)

## Related

- [npm package.json documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json)
- [Publishing packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
