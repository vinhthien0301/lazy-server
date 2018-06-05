ALTER TABLE `trRigEvent`
ADD PRIMARY KEY (`id`);

ALTER TABLE `trRigEvent`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE trRigEvent
ADD COLUMN `updated_at` TIMESTAMP ;

ALTER TABLE trRigEvent
ADD COLUMN `created_at` TIMESTAMP ;

ALTER TABLE trRigEvent
ADD COLUMN `deleted` int(11) NOT NULL DEFAULT '0' ;

INSERT INTO `trDownloadLink`(`software`, `version`, `download_link`, `filename`, `latest`)
VALUES ('XMR-STAK', '2.2.0', 'http://lazymining.com/lazy-desktop/softwares/xmr-stak-win64-v2.2.0.zip', 'xmr-stak-win64', 1);