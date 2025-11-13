import { describe, it, expect } from 'vitest'
import validatePackageJson from '../validate'

describe('validatePackageJson', () => {
  it('should validate a complete package.json with all recommended fields', () => {
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
      repository: {
        type: 'git',
        url: 'git+https://github.com/test/test.git',
      },
      bugs: {
        url: 'https://github.com/test/test/issues',
      },
      homepage: 'https://github.com/test/test#readme',
      engines: {
        node: '>=18.0.0',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
  })

  it('should warn about missing recommended fields', () => {
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
    expect(result.warnings).toContain('Missing recommended field: repository')
    expect(result.warnings).toContain('Missing recommended field: bugs')
    expect(result.warnings).toContain('Missing recommended field: homepage')
    expect(result.warnings).toContain('Missing recommended field: engines')
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

  it('should validate repository object structure', () => {
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
      publishConfig: {
        access: 'public',
      },
      repository: {
        type: 'git',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('repository.url is required')
  })

  it('should accept repository as string', () => {
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
      publishConfig: {
        access: 'public',
      },
      repository: 'github:user/repo',
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should validate bugs object structure', () => {
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
      publishConfig: {
        access: 'public',
      },
      bugs: {
        email: 'test@example.com',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'bugs.url is required when bugs is an object'
    )
  })

  it('should accept bugs as string', () => {
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
      publishConfig: {
        access: 'public',
      },
      bugs: 'https://github.com/test/test/issues',
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should validate homepage is a string', () => {
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
      publishConfig: {
        access: 'public',
      },
      homepage: { url: 'https://example.com' },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('homepage must be a string')
  })

  it('should validate engines object structure', () => {
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
      publishConfig: {
        access: 'public',
      },
      engines: 'node >=18',
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('engines must be an object')
  })

  it('should warn about missing engines.node', () => {
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
      publishConfig: {
        access: 'public',
      },
      engines: {
        npm: '>=9.0.0',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.warnings).toContain(
      'engines.node is recommended to specify Node.js compatibility'
    )
  })

  it('should pass with all required fields and some recommended', () => {
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
      repository: {
        type: 'git',
        url: 'git+https://github.com/scope/test-package.git',
      },
      engines: {
        node: '>=18.0.0',
      },
    }

    const result = validatePackageJson(pkg)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toContain('Missing recommended field: bugs')
    expect(result.warnings).toContain('Missing recommended field: homepage')
  })
})
