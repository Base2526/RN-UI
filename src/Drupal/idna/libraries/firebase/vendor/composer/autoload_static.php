<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitd8e0bf2ecfb2c1dddd6e616df08d902d
{
    public static $classMap = array (
        'Firebase\\Error' => __DIR__ . '/..' . '/ktamas77/firebase-php/src/firebaseStub.php',
        'Firebase\\FirebaseInterface' => __DIR__ . '/..' . '/ktamas77/firebase-php/src/firebaseInterface.php',
        'Firebase\\FirebaseLib' => __DIR__ . '/..' . '/ktamas77/firebase-php/src/firebaseLib.php',
        'Firebase\\FirebaseStub' => __DIR__ . '/..' . '/ktamas77/firebase-php/src/firebaseStub.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->classMap = ComposerStaticInitd8e0bf2ecfb2c1dddd6e616df08d902d::$classMap;

        }, null, ClassLoader::class);
    }
}