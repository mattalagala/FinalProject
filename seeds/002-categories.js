exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("category")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("category").insert([
        {
          category_id: "0cc62b56-b8d9-4db0-b1e3-912b1a6c290e",
          category_name: "Project 1",
          category_description: "test Description!",
          category_team_name: "newTeamName",
          category_languages: "JavaScript, React, SQL",
          category_picture: "https://picsum.photos/620/620",
          category_picture2: "https://picsum.photos/620/620",
          category_picture3: "https://picsum.photos/620/620",
          category_picture4: "https://picsum.photos/620/620",
          category_picture5: "https://picsum.photos/620/620",
          category_picture6: "https://picsum.photos/620/620",
          category_picture7: "https://picsum.photos/620/620",
          category_picture8: "https://picsum.photos/620/620",
        },
        // {category_id: 2, category_name :'Acoustic Guitar', category_picture: 'https://picsum.photos/620/620'},
        // {category_id: 3, category_name :'Amplifier', category_picture: 'https://picsum.photos/620/620'},
        // {category_id: 4, category_name :'Bass', category_picture: 'https://picsum.photos/620/620'},
        // {category_id: 5, category_name :'Midi Controller', category_picture: 'https://picsum.photos/620/620'},
      ]);
    });
};

// id serial primary key,
// "category_name" text,
// "category_picture" text,
