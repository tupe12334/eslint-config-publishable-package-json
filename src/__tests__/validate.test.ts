import { describe, it, expect } from 'vitest'
import { validatePackageJson } from '../validate'

describe('validatePackageJson', () => {
  it('should validate a complete package.json', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      description: 'Test package',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      files: ['dist'],
      keywords: ['test'],
      author: 'Test Author',
      license: 'MIT',
      publishConfig: {
        access: 'public',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should detect missing required fields', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
    expect(result.errors).toContain('Missing required field: description')
    expect(result.errors).toContain('Missing required field: main')
  })

  it('should detect missing publishConfig', () => {
    const pkg = {
      name: 'test-package',
      version: '1.0.0',
      description: 'Test',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      files: ['dist'],
      keywords: ['test'],
      author: 'Test',
      license: 'MIT',
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing publishConfig field')
  })

  it('should pass with all required fields', () => {
    const pkg = {
      name: '@scope/test-package',
      version: '0.1.0',
      description: 'A test package for validation',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      files: ['dist', 'README.md'],
      keywords: ['test', 'validation'],
      author: 'Test Author <test@example.com>',
      license: 'MIT',
      publishConfig: {
        access: 'public',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})
