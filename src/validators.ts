/**
 * Validation helper functions for package.json fields
 */

function validateRepository(
  packageJson: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  if (!('repository' in packageJson)) {
    warnings.push('Missing recommended field: repository')
    return
  }

  const repo = packageJson.repository
  if (typeof repo === 'object' && repo !== null) {
    if (!('type' in repo)) {
      errors.push('repository.type is required')
    }
    if (!('url' in repo)) {
      errors.push('repository.url is required')
    }
  } else if (typeof repo !== 'string') {
    errors.push('repository must be an object with type and url, or a string')
  }
}

function validateBugs(
  packageJson: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  if (!('bugs' in packageJson)) {
    warnings.push('Missing recommended field: bugs')
    return
  }

  const bugs = packageJson.bugs
  if (typeof bugs === 'object' && bugs !== null) {
    if (!('url' in bugs)) {
      errors.push('bugs.url is required when bugs is an object')
    }
  } else if (typeof bugs !== 'string') {
    errors.push('bugs must be an object with url, or a string')
  }
}

function validateHomepage(
  packageJson: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  if (!('homepage' in packageJson)) {
    warnings.push('Missing recommended field: homepage')
  } else if (typeof packageJson.homepage !== 'string') {
    errors.push('homepage must be a string')
  }
}

function validateEngines(
  packageJson: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  if (!('engines' in packageJson)) {
    warnings.push('Missing recommended field: engines')
    return
  }

  const engines = packageJson.engines
  if (typeof engines === 'object' && engines !== null) {
    if (!('node' in engines)) {
      warnings.push(
        'engines.node is recommended to specify Node.js compatibility'
      )
    }
  } else {
    errors.push('engines must be an object')
  }
}

export default {
  validateRepository,
  validateBugs,
  validateHomepage,
  validateEngines,
}
