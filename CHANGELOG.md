# Change Log

All notable changes to the "crestron-simpl-plus" extension will be documented in this file.

## 2.0.0

- Added support for 4-series targets.
- References to processor series have been removed from compile commands.
- Target processor series for compile commands is now specified through settings.

## 1.3.3

- Fixed constant definition highlighting.
- Added a partial implementation of variable highlighting.

## 1.3.2

- Fixed a bug where visualize simpl+ wouldn't work if the visualize panel was closed manually.

## 1.3.1

- Added new functions, error codes, structures and more to syntax highlighting.
- Updated dependencies for fix vulnerabilities.
- Added .usl support.

## 1.3.0

- Added support for opening and generating Simpl# API files.
- Syntax highlighting for Simpl# API files.
- Fixed an issue in the visualizer with multiple signal detection.

## 1.2.3

- Minor additional syntax highlighting improvements.

## 1.2.2

- Big improvements to syntax detection. (Function highlighting, signal name highlighting, etc)
- Various Syntax related bug fixes (special characters breaking string detection, improper highlighting, etc)


## 1.2.1

- Add 'threadsafe' to syntax detection.
- Handle '#output_shift' compiler directive in visualizer.

## 1.2.0

- Added a live visualizer to preview your modules in real time.

## 1.1.0

- Remove code snippets from main plugin and place them in a separate extension.

## 1.0.0

- Initial release
