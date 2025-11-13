import validators from './validators'

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates if a package.json has all required fields for publishing
 */
function validatePackageJson(
  packageJson: Record<string, unknown>
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required fields for publishable packages
  const requiredFields = [
    'name',
    'version',
    'description',
    'main',
    'types',
    'files',
    'keywords',
    'author',
    'license',
  ]

  for (const field of requiredFields) {
    if (!(field in packageJson)) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Check for publishConfig
  if (!('publishConfig' in packageJson)) {
    errors.push('Missing publishConfig field')
  }

  // Validate recommended fields with proper structure
  validators.validateRepository(packageJson, errors, warnings)
  validators.validateBugs(packageJson, errors, warnings)
  validators.validateHomepage(packageJson, errors, warnings)
  validators.validateEngines(packageJson, errors, warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export default validatePackageJson
