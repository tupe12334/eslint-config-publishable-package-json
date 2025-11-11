/**
 * Validates if a package.json has all required fields for publishing
 */
export function validatePackageJson(packageJson: Record<string, unknown>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

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

  return {
    valid: errors.length === 0,
    errors,
  }
}
