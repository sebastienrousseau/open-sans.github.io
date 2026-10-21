# Changelog

## [0.0.3]

### Fixed

- `open-sans.css` loads its fonts from the package (`fonts/...`) instead
  of `https://open-sans.com/fonts/...`, so the fonts shipped on npm are
  the ones used.
- `css/OpenSansHebrew.css` uses package-relative paths and the real
  `OpenSansHebrew-regular.*` filenames; the Regular weight failed to load
  on case-sensitive hosts.
- `repository`, `bugs` and download links point to
  `sebastienrousseau/open-sans.github.io`.
- The stylesheet header states the actual licence, `Apache-2.0 OR MIT`.

### Changed

- The npm package ships only the stylesheets, fonts and licences
  (`files` in `package.json`); the website (HTML, images, favicon,
  `CNAME`, `sitemap.xml`) is no longer published.
- `npm test` runs `scripts/check-fonts.mjs`, which fails if any font
  `url()` does not resolve to a file in the package.

[0.0.3]: https://github.com/sebastienrousseau/open-sans.github.io/compare/0.0.2...v0.0.3
