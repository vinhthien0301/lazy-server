ALTER TABLE trSocketInfo
ADD COLUMN `machine_id` varchar(200) COLLATE utf8_unicode_ci NOT NULL


RENAME TABLE `trSocketInfo` TO `trSocketMinerInfo`


CREATE TABLE `trSocketMobileInfo` (
  `id` int(11) NOT NULL ,
  `socket_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `device_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `trSocketMobileInfo`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trSocketMobileInfo`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;