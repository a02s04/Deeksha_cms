import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_previous_work_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`title\` text NOT NULL,
  	\`category\` text,
  	\`location\` text,
  	\`year\` text,
  	\`description\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_previous_work_items_order_idx\` ON \`site_settings_previous_work_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_previous_work_items_parent_id_idx\` ON \`site_settings_previous_work_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_previous_work_items_image_idx\` ON \`site_settings_previous_work_items\` (\`image_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`previous_work_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`previous_work_heading\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`previous_work_description\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_previous_work_items\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`previous_work_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`previous_work_heading\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`previous_work_description\`;`)
}
