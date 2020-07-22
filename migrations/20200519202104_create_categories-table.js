const createCategoryTable = `
create table category (
"category_id" uuid primary key,
"category_name" text,
"category_description" text,
"category_team_name" text,
"category_languages" text,
"category_picture" text,
"category_picture2" text,
"category_picture3" text,
"category_picture4" text,
"category_picture5" text,
"category_picture6" text,
"category_picture7" text,
"category_picture8" text,
ctime timestamptz,
mtime timestamptz default current_timestamp
)
`;
const dropCategoryTable = `
drop table Category;
`;

exports.up = function (knex) {
  return knex.raw(createCategoryTable);
};

exports.down = function (knex) {
  return knex.raw(dropCategoryTable);
};
