CREATE TABLE `items` (
	`id` varchar(50) NOT NULL,
	`name` varchar(255),
	`slot` varchar(50),
	CONSTRAINT `items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_items` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(42) NOT NULL,
	`item_id` varchar(36) NOT NULL,
	`obtained_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(42) NOT NULL,
	`total_boxes` int DEFAULT 0,
	`opened_boxes` int DEFAULT 0,
	`created_at` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
