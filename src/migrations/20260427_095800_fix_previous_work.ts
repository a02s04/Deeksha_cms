import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings_previous_work_items\` RENAME TO \`site_settings_home_page_previous_work_items\`;`)
  
  // Create new columns
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`home_page_previous_work_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`home_page_previous_work_heading\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`home_page_previous_work_description\` text;`)

  // Copy data
  await db.run(sql`UPDATE \`site_settings\` SET \`home_page_previous_work_eyebrow\` = \`previous_work_eyebrow\`, \`home_page_previous_work_heading\` = \`previous_work_heading\`, \`home_page_previous_work_description\` = \`previous_work_description\`;`)

  // Drop old columns
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`previous_work_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`previous_work_heading\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`previous_work_description\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings_home_page_previous_work_items\` RENAME TO \`site_settings_previous_work_items\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`previous_work_eyebrow\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`previous_work_heading\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`previous_work_description\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`home_page_previous_work_eyebrow\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`home_page_previous_work_heading\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`home_page_previous_work_description\`;`)
}
