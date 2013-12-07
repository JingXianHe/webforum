<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'grifare_wForum');

/** MySQL database username */
define('DB_USER', 'grifare_wForum');

/** MySQL database password */
define('DB_PASSWORD', '8qw7a3P3vS');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'rlheguiwz0wvxh4ac6kongk6speqduawe5h6gvhido3m9rpwy7vbxza4dteqwnxh');
define('SECURE_AUTH_KEY',  'a1b31wunbyt9hc6arvot2cj2dpqfgfxjfwcp4ervd4cnquam7xgfzdwbjd3pux4e');
define('LOGGED_IN_KEY',    'snincpopg7at4hxahhei0xqgodbu3xuvzkfvluv96yqrvrvlynfrkxyhstw7leef');
define('NONCE_KEY',        'cidwiqtfgiituhv0t8dkqqcythbydeu1ezbir437rwheuhakhmonz5jwfiwyuh5t');
define('AUTH_SALT',        '4edvihi0avleuueq8wsdycsbpbmwm6wezrtuvg4yvc90sgefymcinioyvjuwxaz2');
define('SECURE_AUTH_SALT', 'x0imjqietait1fripdltwrqxfu0hrrgel6ttxu47pv3rgrdycklteebx83f6lgbn');
define('LOGGED_IN_SALT',   'sjtmrqub8tydw0m8mmau3u6ek9gccotvhaqph4zx2okwcrfbjvakic4cbmzj6gml');
define('NONCE_SALT',       'fct6ydfrfq8bjiuqhquvqwg0g1juo0dxfbnbmm46jfa68n57dytgrq3writyvuis');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
