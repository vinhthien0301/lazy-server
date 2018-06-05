
CREATE TABLE `trSocketInfo` (
  `id` int(11) NOT NULL ,
  `socket_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `email` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


ALTER TABLE `trSocketInfo`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trSocketInfo`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;