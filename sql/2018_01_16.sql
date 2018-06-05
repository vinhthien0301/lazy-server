

ALTER TABLE trLoadRig
ADD COLUMN `lazy_desktop_version` varchar(100) COLLATE utf8_unicode_ci NOT NULL;


ALTER TABLE trLoadRig
ADD COLUMN `lazy_desktop_latest` int(11) NOT NULL DEFAULT '0';

CREATE TABLE `trConfig` (
  `id` int(11) NOT NULL ,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL ,
  `value` varchar(100) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trConfig`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trConfig`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
