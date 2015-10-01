# DevBundle

Bundle gathering tools and libraries useful for Claroline development.

## Tools

### [PHPUnit](https://phpunit.de/)

Unit testing framework.

### [PHP-CS-Fixer](http://cs.sensiolabs.org/)

Detects and fixes coding standard violations. The configuration included 
in this bundle relies on PSR-* and Symfony coding standards (see 
[http://symfony.com/doc/master/contributing/code/standards.html]
(http://symfony.com/doc/master/contributing/code/standards.html)).

### [vfsStream](http://vfs.bovigo.org/)

Creates a virtual filesystem (useful for mocking the real one in unit tests). 

## Commands

### claroline:tool [tool [bundle]]

Launches one of the available tool scripts (located in 
*./Resources/scripts/tools*) for a given bundle.

This command can be used interactively (e.g. to see the 
list of available tools) :

`php app/console claroline:tool`
