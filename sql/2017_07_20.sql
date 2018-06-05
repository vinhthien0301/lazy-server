#--- trDownloadLink ---

CREATE TABLE `trRunBatch` (
  `id` int(11) NOT NULL,
  `platform` varchar(100) COLLATE utf8_unicode_ci NOT NULL, # WINDOWS, UBUNTU, MACOS
  `software` varchar(100) COLLATE utf8_unicode_ci NOT NULL, # CLAYMORE
  `version` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `download_link` text COLLATE utf8_unicode_ci NOT NULL,
  `filename` text COLLATE utf8_unicode_ci NOT NULL,
  `coins_related` varchar(100) NOT NULL, # example: ETH, ETH_DCR, ZEC
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trRunBatch`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trRunBatch`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

INSERT INTO `trRunBatch`(`platform`, `software`, `version`, `download_link`, `filename`, `coins_related`, `description`)
VALUES ('WINDOWS', 'CLAYMORE', '9.7', 'http://lazymining.com/downloads/claymore_eth.zip', 'claymore_eth', 'ETH', 'To mine ETH only');