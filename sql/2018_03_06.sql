CREATE TABLE `trRigSoftwareDownload` (
  `id` int(11) NOT NULL,
  `download_link_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `root_dir` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trRigSoftwareDownload`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trRigSoftwareDownload`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;



ALTER TABLE `trDownloadLink`
ADD COLUMN `process_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trDownloadLink`
ADD COLUMN `command_format` varchar(100) COLLATE utf8_unicode_ci NOT NULL;

ALTER TABLE `trDownloadLink`
ADD COLUMN `platform` varchar(100) COLLATE utf8_unicode_ci NOT NULL;