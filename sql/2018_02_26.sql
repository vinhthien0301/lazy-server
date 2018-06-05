CREATE TABLE `trRigEvent` (
  `id` int(11) NOT NULL ,
  `event_code` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `message` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `idea_suggested` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `machine_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `card_order` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;