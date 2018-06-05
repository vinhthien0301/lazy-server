CREATE TABLE `trLoadRig` (
  `id` int(11) NOT NULL ,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `local_ip` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `main_coin` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `main_coin_hr` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `main_speed_unit` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `mining_info_ready` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `pools` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `show_mode` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `sub_coin` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `sub_coin_hr` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `sub_speed_unit` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `temps` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `total_main_speed` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `total_sub_speed` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `uptime` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `ver` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `working_status` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trLoadRig`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trLoadRig`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `trLoadRig`
MODIFY `mining_info_ready` bool NOT NULL ;