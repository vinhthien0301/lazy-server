#--- trDownloadLink ---

CREATE TABLE `trDownloadLink` (
  `id` int(11) NOT NULL,
  `software` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `version` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `download_link` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `filename` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `latest` int(11) NOT NULL DEFAULT '0',
  `updated_at` TIMESTAMP,
  `created_at` TIMESTAMP,
  `deleted` int(11) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

ALTER TABLE `trDownloadLink`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trDownloadLink`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

INSERT INTO `trDownloadLink`(`software`, `version`, `download_link`, `filename`, `latest`)
VALUES ('CLAYMORES', '9.3', 'https://drive.google.com/uc?export=download&id=0B2vU0tdIaTKxX2ZyRnJIcmNCQ3c', 'Claymore\'s Dual Ethereum+Decred_Siacoin_Lbry_Pascal AMD+NVIDIA GPU Miner v9.3', 1);