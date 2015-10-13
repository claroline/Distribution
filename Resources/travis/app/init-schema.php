<?php

/***************************************************************
 * This script install the database for the test environment.
 **************************************************************/

require __DIR__ . '/autoload.php';
require __DIR__ . '/AppKernel.php';

use Claroline\CoreBundle\Command\Dev\InitTestSchemaCommand;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\ConsoleOutput;

// convert errors to exceptions
set_error_handler(function ($severity, $message, $file, $line) {
    if ($severity !== E_USER_DEPRECATED) {
        throw new ErrorException($message, 0, $severity, $file, $line);
    }
});

$kernel = new AppKernel('test', true);
$kernel->boot();

$cmd = new InitTestSchemaCommand();
$cmd->setContainer($kernel->getContainer());

$application = new Application($kernel);
$application->add($cmd);

$cmd = $application->find('claroline:init_test_schema');
$arguments = ['command' => 'claroline:init_test_schema'];
$cmd->run(new ArrayInput($arguments), new ConsoleOutput());
