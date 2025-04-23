CREATE TABLE `items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(50),
	`slot` varchar(20),
	CONSTRAINT `items_id` PRIMARY KEY(`id`),
	CONSTRAINT `items_slot_name_unique` UNIQUE(`slot`,`name`)
);
--> statement-breakpoint
CREATE TABLE `user_equipments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(42) NOT NULL,
	`slot` varchar(20) NOT NULL,
	`item_id` int NOT NULL,
	`equipped_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_equipments_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_equipments_user_id_slot_unique` UNIQUE(`user_id`,`slot`)
);
--> statement-breakpoint
CREATE TABLE `user_items` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(42) NOT NULL,
	`item_id` int NOT NULL,
	`obtained_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(42) NOT NULL,
	`user_name` varchar(50),
	`character` int DEFAULT 0,
	`clicked_count` int DEFAULT 0,
	`remaining_gift_box` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
