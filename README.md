# grunt-joomla-builder
Package Joomla! Extensions with grunt

## Installation

* Local Joomla installation
	1. Copy files of "joomla" folder in the root folder of local Joomla installation
	2. rename package_template.json to package.json (or adjust current package.json) and update file content
	3. rename paths_template.json to paths.json and update file content
	4. run `npm install` in terminal (in Joomla root dir)


* Extension
	1. Copy files of "extension" folder in the Source folder of joomla extension
	2. rename package_template.json to package.json (or adjust current package.json) and update file content
	3. rename ext_template.json to ext.json and update file content
	4. run `npm install` in terminal (in root dir of extension)

## Use

* In local Joomla  
	`grunt build:<com_sample>:<major|minor|patch>`  
	default is `patch`


* In extension folder  
	`grunt build:<major|minor|patch|no>:<yes|no>`  
	default is `patch`  (`no` if version number should not be bumped)
	default for import (second parameter) is `yes` (`yes` will import files from local joomla installation, `no` will just package and bump version)
