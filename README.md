# crestron-simpl-plus README

VSCode extension for Crestron SIMPL+. Includes syntax highlighting, compiler functions and module I/O visualization.

_Note: To take advantage of the compiler operations, you must have the Crestron provided SIMPL+ Compiler installed._

## Features

* Syntax highlighting for `.usp` and `.usl` files
* Access to compiler functions and target selection from within VSCode
* Real-time module I/O visualization
* Quick access to the SIMPL+ help file
* Quick access to API files associated with SIMPL# libraries

This extension contributes the following commands:

* `extension.simplCC_defaultCompile`: Compiles the currently opened file for the targets specified in a `.ush` file, or using the default target setting if no `.ush` exists.  
* `extension.simplCC_selectCompileSingle`: Provides a target selection dialog, then compiles the currently opened file for the selected targets.
* `extension.simplCC_selectCompileMultiple`: Provides a target selection dialog, then finds all `.usp` files in the open folder and compiles them for the selected targets.
* `extension.simpl_help`: Opens the Crestron SIMPL+ help reference file.
* `extension.simpl_visualize`: Opens a preview window and lets you see the signal layout of the SIMPL+ module in real time. Note: this will automatically fully expand your module signals to their maximum available size.
* `extension.simplCC_API`: Opens the API reference for all SIMPL# libraries used in the current SIMPL+ module.

## Extension Settings

This extension contributes the following settings:

* `simpl.compiler`: sets the path of the SIMPL+ compiler. Can be set to a custom path via the user settings. Please use the double \ to specify directory paths.
* `simpl.helpLocation`: sets the path of the SIMPL+ reference guide. Can be set to a custom path via the user settings. Please use the double \ to specify directory paths.
* `simpl.terminalLocation`: sets path of the default windows cmd.exe. Can be set to a custom path via the user settings. Please use the double \ to specify directory paths. 

* `simpl.defaultTarget`: specifies the default command line `\target` option to send to the SIMPL+ compiler when a `.ush` file is not available.

## Keybindings and Menus

All commands are added to the right click context menu of the editor tab, and the following keybindings have been added.

* `CTRL+F1` - _Open SIMPL+ Help_
* `CTRL+F12` - _Compile current file_:  
    If a `.ush` file is available, the targets specified within will be used.  Otherwise, the default targets specified in the extension's settings will be applied.
* `CTRL+ALT+F12` - _Select targets and compile current file_:  
    Provides a dialog for selecting the desired processor targets, then compiles the current file using that selection.  
* `CTRL+SHIFT+F12` - _Select target and compile all files_:  
    Provides a dialog for selecting the desired processor targets, then compiles all `.usp` files in the open folder using that selection.

## Snippets

So users can utilize their own snippets if desired, code snippets are available in a separate extension named "Crestron SIMPL+ Code Snippets".

## Known Issues

* **SIMPL+ Help File** - Help is not context-sensitive, so a manual search within the help file is required to get information about specific features/functions.

* **API Files** - The `View SIMPL# API` command is not context-sensitive.  It will load the `.api` file(s) for all SIMPL# libraries used in the current module.

* **API Files** - If the SIMPL# CLZ is recently generated, the API file opened may not be the newest available. If this happens, try a compile and then attempt opening the API file again.

* **API Files** - Syntax highlighting is not 100% fleshed out for these files (particularly if a fallback to a `.h` file is required), so some elements may not get highlighted as expected.

## Release Notes

## 2.0.0

**EXISTING EXTENSION USERS:** In addition to the changes noted below, the extension _publisher_ and _repository_ data fields have been updated to point to the correct (current) locations.  This makes VSCode treat this version as a whole new extension, and it will be installed *alongside* an older version rather than simply updating it.  **To prevent conflicts, you will need to uninstall any older versions of the extension (<=1.3.3).**  This is a one-time process, and will not be required when updating to future (>2.0.0) versions.

* Complete re-work of compile options and target selection:
  * `CTRL+F12` - _Compile current file_:  
    If a `.ush` file is available, the targets specified within will be used.  Otherwise, the default targets specified in the extension's settings will be applied.
  * `CTRL+ALT+F12` - _Select targets and compile current file_:  
    Provides a dialog for selecting the desired processor targets, then compiles the current file using that selection.  
  * `CTRL+SHIFT+F12` - _Select target and compile all files_:  
    Provides a dialog for selecting the desired processor targets, then compiles all `.usp` files in the open folder using that selection.  
* Added support for 4-series targets.
* If a SIMPL# `.api` file cannot be found, the library's `.h` file will be displayed as a fallback.
* SIMPL# `.api` file _generation_ has been disabled because the necessary build tool is no longer available.
* The module visualizer now reads and processes constants defined in `.usl` files.
* Updated extension and dependencies based on current Yeoman/generator-code scaffolding.
* Some code cleanup and refactoring

## 1.3.3

* Fixed constant definition highlighting.
* Added a partial implementation of variable highlighting.

## 1.3.2

* Fixed a bug where visualize SIMPL+ wouldn't work if the visualize panel was closed manually.

## 1.3.1

* Added new functions, error codes, structures and more to syntax highlighting.
* Updated dependencies for fix vulnerabilities.
* Added .usl support.

### 1.3.0

* Added support for opening and generating SIMPL# API files.
* Syntax highlighting for SIMPL# API files.
* Fixed an issue in the visualizer with multiple signal detection.

### 1.2.3

* Minor additional syntax highlighting improvements.


### 1.2.2

* Big improvements to syntax detection. (Function highlighting, signal name highlighting, etc)
* Various Syntax related bug fixes (special characters breaking string detection, improper highlighting, etc)


### 1.2.1

* Add 'threadsafe' to syntax detection.
* Handle '#output_shift' compiler directive in visualizer.

### 1.2.0

* Added Simpl module visualizer.

### 1.1.0

* Remove snippets. Snippets are now available in mwgustin.crestron-simpl-plus-snippets

### 1.0.0

* Initial release