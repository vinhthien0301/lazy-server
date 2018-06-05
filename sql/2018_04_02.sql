ALTER TABLE `trRunBatch`
ADD COLUMN `email` varchar(200) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trRunBatch`
ADD COLUMN `is_global` int(11) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0';

CREATE TABLE `trRole` (
  `id` int(11) NOT NULL,
  `role_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0',
   `updated_at` varchar(100),
  `created_at` varchar(100)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trRole`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trRole`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

INSERT INTO `trRole` (`id`, `role_name`, `deleted`, `updated_at`, `created_at`) VALUES (NULL, 'Admin', '0', '2018-04-01T17:26:54.542+00:00', '2018-04-01T17:26:54.542+00:00'), (NULL, 'User', '0', '2018-04-01T17:26:54.542+00:00', '2018-04-01T17:26:54.542+00:00');

ALTER TABLE `trUser`
ADD COLUMN `user_role` int(11) COLLATE utf8_unicode_ci NOT NULL;

UPDATE `trUser` SET `user_role`=2

UPDATE `trUser` SET `user_role` = '1' WHERE `trUser`.`id` = 1;

