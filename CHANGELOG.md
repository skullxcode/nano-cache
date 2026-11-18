# Changelog

All notable changes to this project will be documented in this file.

## [2.0.1] - 2026-11-18

### Fixed

- Fix replacement and eviction behavior for expired cache entries.
- Remove expired entries promptly when they are overwritten.
- Clean up expired entries before capacity eviction only when the cache is full.

### Changed

- Add Node.js 18 as the documented minimum runtime.
- Mark the package as publicly accessible in npm configuration.
- Update the test scripts to cover JavaScript tests and TypeScript declarations.

### Documentation

- Clarify key validation and `null` value behavior in the API documentation.
- Correct the copyright and formatting in the license.
