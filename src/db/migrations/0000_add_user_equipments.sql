CREATE TABLE `user_equipments` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(42) NOT NULL,
  `slot` varchar(20) NOT NULL,
  `item_id` varchar(36) NOT NULL,
  `equipped_at` datetime DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `user_equipments_id` PRIMARY KEY(`id`)
); 