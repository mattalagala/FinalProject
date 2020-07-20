const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
require("./passport");

//Image Upload
const multer = require("multer");
const path = require("path");
const normalize = require("normalize-path");

const db = require("./lib/db");
const check = require("./lib/validate");
// const { validImage } = require('./lib/validate')
// const validate = require('./lib/validate')

const app = express();

// serve files out of the public directory
app.use(express.static("./public"));

app.use(express.urlencoded({ extended: true }));

const port = 9999;

//Cookie Sessions
app.use(
  cookieSession({
    name: "musicmonk-session",
    keys: ["key1", "key2"],
  })
);

//Check if User is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

//Google Authentication functions
app.use(passport.initialize());
app.use(passport.session());

// set the template engine
app.set("view engine", "hbs");

app.get("/logged_out", (req, res) => {
  res.send("You are not logged in!");
});

//Google Route Failure
app.get("/failed", (req, res) => res.send("Login Failed"));
app.get("/success", isLoggedIn, (req, res) => {
  db.getCategoryList().then((lists) => {
    res.render("index", { lists: lists });
  });
});

// Google Authentication
app.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

// const isAuthenticated = function authenticate () {
//   if (passport.authenticate.user.id == '') {
//     console.log('#@#@##@ I GUESSSS IT WORKED @##$#@#@#$')
//   } else (
//     console.log('!!!!! GUESS IT DIDNT WORK !!!!')
//   )
// }

app.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.render("login", { logoutMessage: "You've been logged out!" });
  // res.redirect('/login')
});

// // Shows the lists on the homepage
app.get("/", function (req, res) {
  db.getCategoryList().then((lists) => {
    res.render("index", { lists: lists });
  });
});

app.get("/login", function (req, res) {
  db.getCategoryList().then((lists) => {
    res.render("login", { lists: lists });
  });
});

app.get("/form", isLoggedIn, function (req, res) {
  db.getCategoryList().then((lists) => {
    res.render("form", { lists: lists });
  });
});

//Storage Engine
// const storage = multer.diskStorage({
//   destination: './public/uploads',
//   filename: function (req, file, cb){
//     cb(null, file.fieldname + '-' + Date.now() +
//     path.extname(file.originalname))
//   }
// })

//Init Upload
// const upload = multer({
//   storage: storage
// }).single('projectImage1')

app.get("/add_project", isLoggedIn, function (req, res) {
  res.render("add_project");
});

// app.post("/add_projects", (req, res) => {
//   upload(req, res, (err) => {
//     console.log(req.file);
//     if (err) {
//       res.render("add_project", {
//         msg: err,
//       });
//     } else {
//       if (req.file == undefined) {
//         res.render("add_project", {
//           msg: "Error: No File Selected!",
//         });
//       } else {
//         res.render("add_project", {
//           msg: "File Uploaded!",
//           file: `uploads/${req.file.filename}`,
//         });
//       }
//     }
//   });
// });

// app.get("/add_project", (req, res) => res.render("add_project"));
// const upload = multer({ dest: "./public/uploads/" });

// var cpUpload = upload.fields([
//   { name: "projectImage1", maxCount: 1 },
//   { name: "projectName", maxCount: 1 },
// ]);

//Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// // Init Upload

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    check.checkFileType(file, cb);
  },
});

// Check File Type
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

app.post("/add_project", upload.single("projectImage1"), (req, res, next) => {
  const newProjectName = req.body.projectName;
  const newProjectDescription = req.body.projectDescription;
  const newTeamName = req.body.teamName;
  const languagesUsed = req.body.languagesUsed;

  const projectImage1 = req.file;
  const projectImage2 = req.file;
  if (req.file != null) {
    projectImage1 = req.file.filename;
  }

  const newDescription = req.body.description;
  console.log(
    "******************************",
    req.body,
    "******************************"
  );
  if (check.validDescription(newProjectName)) {
    res.render("new_project", {
      name: req.body.projectName,
      description: req.body.projectDescription,
      image: req.file.path,
      filename: req.file.filename,
    });
  } else if (check.validDescription(newProjectDescription)) {
    res.render({ description: req.body.projectDescription });
  } else if (check.validDescription(newTeamName)) {
    res.send("Project Loaded Successfully");
  } else if (check.validDescription(languagesUsed)) {
    res.send("Project Loaded Successfully");
  } else {
    res.status(400).send("bad input");
  }
  console.log(req.body, "IS IT GETTING PAST THIS!!!!");
  console.log(req.file, "IS IT GETTING PAST IMAGGEE!!!!");

  db.createProject(
    newProjectName,
    newProjectDescription,
    newTeamName,
    languagesUsed,
    projectImage1
  )
    .then((newProject) => {
      console.log("I AM IN createProject PROMISE");
      res.render("new_project", {
        projectName: newProject.projectName,
      });
    })
    .catch(() => {
      //NEED TO GET THIS FIXED
      // res.status(500).send("The Function Didnt WOrk)
    });

  // res.redirect("/login");
});

app.param("category_id", function (req, res, nextFn, category_id) {
  const getProductsPromise = db.getProducts(category_id);
  const getCategoryPromise = db.getCategory(category_id);
  Promise.all([getProductsPromise, getCategoryPromise])
    .then(([products, category]) => {
      req.monkMusic = req.monkMusic || {};
      req.monkMusic.products = products;
      req.monkMusic.category = category;
      console.log("******* THIS IS THE PRODUCTS *******");
      console.log(category, "*****HEEEEYYYYYYYYYYYYYYY");
      nextFn();
    })
    .catch((err) => {
      console.log("AARHHHHHH DIDNT WORK", err);
      res.status(404).send("error_page");
    });
});

app.get("/category/:category_id", isLoggedIn, function (req, res) {
  const theProducts = req.monkMusic.products;
  const theCategory = req.monkMusic.category;
  console.log(theCategory, "**#*#*#*#*#*#* CHECK THIS OUT!!");
  db.getCategoryList().then((lists) => {
    res.render("products_page", {
      theProducts: theProducts,
      theCategory: theCategory,
    });
  });
});

app.param("products_id", function (req, res, nextFn, products_id) {
  db.getItem(products_id)
    .then((item) => {
      req.monkMusic = req.monkMusic || {};
      req.monkMusic.item = item;
      console.log("******* THIS IS THE PRODUCTS *******");
      console.log(item, "*****HEEEEYYYYYYYYYYYYYYY");
      nextFn();
    })
    .catch((err) => {
      console.log("AARHHHHHH DIDNT WORK", err);
      res.status(404).send("uh oh");
    });
});

app.get("/category/:category_id/:products_id", isLoggedIn, function (req, res) {
  const theItem = req.monkMusic.item;
  console.log(theItem, "**#*#*#*#*#*#* getItem PROMISE");
  db.getProductsList()
    .then((result) => {
      res.render("item_page", { theItem: theItem });
    })
    .catch((err) => {
      res.status(404).send("error_page");
    });
});

const startExpressApp = () => {
  app.listen(port, () => {
    console.log("express is listening on port " + port);
  });
};

function bootupSequenceFailed(err) {
  console.error("Uh Ohh... could not connect to the database!:", err);
  console.error("Goodbye!");
  process.exit(1);
}

function fetchCategoryList() {
  db.getCategoryList().then((lists) => {});
}

function fetchProductsList() {
  db.getProductsList().then((products) => {
    console.log(products);
  });
}

// Global kickoff point
db.connect()
  .then(startExpressApp)
  .then(fetchProductsList)
  .then(fetchCategoryList)

  .then(() => {
    console.log("You connected to the database!");
  })
  .catch(bootupSequenceFailed);

app.get("/image", function (req, res) {
  res.render("image");
});

// FILE UPLOADS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!********************************************

//   const express = require("express");
// const multer = require("multer");
// const ejs = require("ejs");
// const path = require("path");

// Set The Storage Engine
// const storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// // Init Upload

// // const upload = multer({ dest: "add_project/" });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// }).single("projectImage1");

// // Check File Type
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif/;
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb("Error: Images Only!");
//   }
// }

// Init app
// const app = express();

// EJS
// app.set("view engine", "ejs");

// Public Folder
// app.use(express.static("./public"));

// app.get("/add_project", (req, res) => res.render("add_project"));

// var cpUpload = upload.fields([
//   { name: "projectImage1", maxCount: 1 },
//   { name: "projectName", maxCount: 1 },
// ]);

// app.post("/add_project", cpUpload, (req, res) => {
//   console.log(req.file, "THIS IS FILE!!!!, FROM POST");
//   console.log(req.body, "THIS IS BODY!!! FROM POST");
// upload(req, res, (err) => {
//   if (err) {
//     res.render("add_project", {
//       msg: err,
//     });
//   } else {
//     if (req.file == undefined) {
//       res.render("add_project", {
//         msg: "Error: No File Selected!",
//       });
//     } else {
//       console.log(req.file);
//       res.render("add_project", {
//         msg: "File Uploaded!",
//         file: `uploads/${req.file.filename}`,
//       });
//     }
//   }
// });
// });

// const port = 3000;

// app.listen(port, () => console.log(`Server started on port ${port}`));
