<?php

return [
    'autoload' => false,
    'hooks' => [
        'app_init' => [
            'venue',
        ],
        'upgrade' => [
            'venue',
        ],
    ],
    'route' => [],
    'priority' => [],
    'domain' => '',
];
