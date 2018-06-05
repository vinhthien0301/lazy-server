#--- trAuthRig ---


CREATE TABLE `trAuthRig` (
  `id` int(11) NOT NULL,
  `token` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trAuthRig`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trAuthRig`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


#--- trAuthFrontEnd ---


CREATE TABLE `trAuthFrontEnd` (
  `id` int(11) NOT NULL,
  `token` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trAuthFrontEnd`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trAuthFrontEnd`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


#--- trUser ---


CREATE TABLE `trUser` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trUser`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trUser`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


#--- trPushToken ---


CREATE TABLE `trPushToken` (
  `id` int(11) NOT NULL,
  `push_token` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trPushToken`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trPushToken`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

