CREATE TABLE `trOrder` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `status` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT 'NEW;PAID;IGNORE;DISPUTED',
  `amount` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT 'Currency: VND',
  `payment_method` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT 'VIETCOMBANK;SACOMBANK',
  `updated_at` TEXT,
  `created_at` TEXT,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trOrder`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trOrder`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `trUser`
ADD COLUMN `expired_at` TEXT COLLATE utf8_unicode_ci NOT NULL ;