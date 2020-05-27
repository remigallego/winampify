# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.3.2 - 27th May 2020
### Added
- Delete desktop file with Delete key
- Continuous Deployment
- Winamp icon

### Changed
- Improved Dark Mode specifics
- Refactored `SpotifyMediaClass`
- Fixed Google Analytics issue


## 0.3.1 - 10th January 2020
### Added
- Add Inspectlet
- Add Login logic and screen on Explorer

### Changed
- Reduce grayscale effect on background explorers

### Removed
- Removed Landing Page


## 0.3.0 - 29th December 2019
### Added
- Add playlist discovery + Adding tracks
- Add settings menu
- Add theme and dark mode
- Improve explorer UI
- Improve explorer performance with virtual lists
- Use Webamp NPM package
- Implement refresh token logic

### Changed
- Change icons
- Refactor api functions to keep fetching recursively
- Data transfer now goes through Redux
- Refactor class-based components to functions, and refactor to Hooks
- Refactor styles to styled-components
- Change background color

### Fixed
- Fix scroll issues on Explorer

### Removed
- Remove persisted state because this was limiting scalability and refactoring of the architecture. Will be re-implemented in the future, hopefully.

## 0.2.2 - 29th May 2019
### Added
- Error tracking with [Sentry](sentry.io)
- Login window opens as popup
- Auto login upon refresh

### Fixed
- Check valid url query params

## 0.2.1 - 28th May 2019
### Added
- Text on empty filter types search
- Changelog

### Changed
- Use different Redux configs for dev/prod environments
- Optimized images

### Fixed
- Error on PUT response
- Wrong search pagination explorer id
- Undefined action type caused by bindActionCreators
- Kiscellaneous tslint warnings

### Removed
- Removed a bunch of console logs and deprecated comments
