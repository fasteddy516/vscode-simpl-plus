# crestron-simpl-plus README

VSCode Extension which adds syntax highlighting and provides commands in the command pallete for compiling.

Note: To take advantage of the compiler operations, you must have the Crestron provided Simpl+ Compiler installed.

## Features

Syntax highlighting. Compiler.

TODO: code file-type icons, maybe better intellisense + autocompletes.

This extension contributes the following commands:

* `extension.simplCC_Series3`: Compiles the currently opened file if it is a SIMPL+ .usp. Targeted at the 3series processors.
* `extension.simplCC_Series2and3`: Compiles the currently opened file if it is a SIMPL+ .usp. Targeted at both the 2series and 3series processors.
* `extension.simplCC_Series3All`: Finds all .usp files in the open folder and compiles them all. Targeted at 3series processors only.
* `extension.simpl_help`: Opens the Crestron SIMPL+ help reference file.
* `extension.simpl_visualize`: Opens a preview window and lets you preview the signal layout in real time. Note: this will automatically fully expand your module signals to their maximum available size.

## Extension Settings

This extension contributes the following settings:

* `simpl.compiler`: sets the path of the Simpl+ compiler. Can be set to a custom path via the user settings. Please use the double \ to specify directory paths.
* `simpl.helpLocation`: sets the path of the SIMPL+ reference guide. Can be set to a custom path via the user settings. Please use the double \ to specify directory paths.
* `simpl.terminalLocation`: sets path of the default windows cmd.exe. Can be set to a custom path via the user settings. Please use the double \ to specify directory paths. 

## Keybindings and Menus

All commands are added to the right click context menu of the editor tab, and the following keybindings have been added.

* `ctrl+F1`: Opens Simpl+ Help.
* `ctrl+F12`: Compiles current file for Series3.
* `ctrl+alt+F12`: Compiles current file for Series2 and Series3
* `ctrl+shift+F12`: Compiles all .usp files in the open working folder for Series3.

## Snippets

So users can utilize their own snippets if desired, code snippets are available in a separate extension named "Crestron Simpl+ Code Snippets".

## Known Issues

* API files - if CLZ is recently generated, the API file opened or generated may not be the newest available. If this happens, try a compile and then attempt opening the API file again.

## Release Notes

## 1.3.3

- Fixed constant definition highlighting
- Added a partial implementation of variable highlighting

## 1.3.2

- Fixed a bug where visualize simpl+ wouldn't work if the visualize panel was closed manually.

## 1.3.1

- Added new functions, error codes, structures and more to syntax highlighting.
- Updated dependencies for fix vulnerabilities.
- Added .usl support.

### 1.3.0

- Added support for opening and generating Simpl# API files.
- Syntax highlighting for Simpl# API files.
- Fixed an issue in the visualizer with multiple signal detection.

### 1.2.3

- Minor additional syntax highlighting improvements.


### 1.2.2

- Big improvements to syntax detection. (Function highlighting, signal name highlighting, etc)
- Various Syntax related bug fixes (special characters breaking string detection, improper highlighting, etc)


### 1.2.1

- Add 'threadsafe' to syntax detection.
- Handle '#output_shift' compiler directive in visualizer.

### 1.2.0

- Added Simpl module visualizer.

### 1.1.0

- Remove snippets. Snippets are now available in mwgustin.crestron-simpl-plus-snippets

### 1.0.0

- Initial release