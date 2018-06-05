
CREATE TABLE `trRigConfig` (
  `id` int(11) NOT NULL ,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `coins_related` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `pool` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `wallet` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `software` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `machine_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `auto_start` int(11) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `trRigConfig`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trRigConfig`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


CREATE TABLE `trAuthWebFrontEnd` (
  `id` int(11) NOT NULL,
  `token` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trAuthWebFrontEnd`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trAuthWebFrontEnd`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;