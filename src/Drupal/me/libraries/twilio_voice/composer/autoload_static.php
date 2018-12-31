<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit6a3e55b8970ea4258320595e081857ed
{
    public static $prefixLengthsPsr4 = array (
        'T' => 
        array (
            'Twilio\\' => 7,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Twilio\\' => 
        array (
            0 => __DIR__ . '/..' . '/twilio/sdk/Twilio',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit6a3e55b8970ea4258320595e081857ed::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit6a3e55b8970ea4258320595e081857ed::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
