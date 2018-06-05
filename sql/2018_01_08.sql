CREATE TABLE `trCardInfo` (
  `id` int(11) NOT NULL ,
  `card_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `card_type` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `card_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

