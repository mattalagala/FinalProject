const express = require('express')
const passport = require('passport')
const cookieSession = require('cookie-session')
require('./passport') 



const db = require('./lib/db')
const { validDescription } = require('./lib/validate')
// const validate = require('./lib/validate')

const app = express()

// serve files out of the public directory
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

const port = 9999

//Cookie Sessions
app.use(cookieSession({
  name: 'musicmonk-session',
  keys: ['key1', 'key2']
}))

//Check if User is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user){
    next()
  } 
  else {    
    res.redirect('/login')
  }
}

//Google Authentication functions
app.use(passport.initialize());
app.use(passport.session());

// set the template engine
app.set('view engine', 'hbs')


app.get('/logged_out', (req, res)=>{
  res.send('You are not logged in!')
})

//Google Route Failure
app.get('/failed', (req, res)=> res.send('Login Failed'))
app.get('/success', isLoggedIn, (req, res)=> {
  db.getCategoryList()
  .then((lists)=>{ 
  res.render('index', {lists: lists})
  })
})


// Google Authentication
app.get('/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));


app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success')
  })


// const isAuthenticated = function authenticate () {
//   if (passport.authenticate.user.id == '') {
//     console.log('#@#@##@ I GUESSSS IT WORKED @##$#@#@#$')
//   } else (
//     console.log('!!!!! GUESS IT DIDNT WORK !!!!')
//   )
// }

app.get('/logout', (req, res)=>{
  req.session = null
  req.logout()
  res.render('login', {logoutMessage:"You've been logged out!"})
  // res.redirect('/login')
})


// // Shows the lists on the homepage
app.get('/', function (req, res) {
  db.getCategoryList()
  .then((lists)=>{ 
    res.render('index', {lists: lists})
  }) 
})

app.get('/login', function (req, res) {
  db.getCategoryList()
  .then((lists)=>{ 
    res.render('login', {lists: lists})
  }) 
})

app.get('/form', function (req, res) {
  db.getCategoryList()
  .then((lists)=>{ 
    res.render('form', {lists: lists})
  }) 
})

app.get('/add_project', function (req, res) {

    res.render('add_project')
 
})




app.post('/add_project', (req, res)=>{
  
  const newDescription = req.body.description
  if (validDescription(newDescription)) {
    res.send("You Did Good")
  } else {
    res.status(400).send('bad input')
  }
  console.log(req.body, "IS IT GETTING PAST THIS!!!!")

  db.createProject(newDescription)
    .then((newProject)=> {
      console.log("I AM IN createProject PROMISE")
      res.render('new_project', {
      description: newProject.description
      })
    })
    .catch(()=>{
      //NEED TO GET THIS FIXED
      // res.status(500).send("We messed up")
    })
  
  // res.redirect('/login')
})    



app.param('category_id', function (req, res, nextFn, category_id) {
 const getProductsPromise = db.getProducts(category_id)
 const getCategoryPromise = db.getCategory(category_id)
    Promise.all([getProductsPromise, getCategoryPromise])
  .then(([products, category]) => {
    req.monkMusic = req.monkMusic || {}
    req.monkMusic.products = products
    req.monkMusic.category = category
    console.log('******* THIS IS THE PRODUCTS *******')
    console.log(category, '*****HEEEEYYYYYYYYYYYYYYY')
    nextFn()
  })
  .catch((err)=> {
    console.log('AARHHHHHH DIDNT WORK', err)
    res.status(404).render('error_page')
  })
})

app.get('/category/:category_id', isLoggedIn, function (req, res) {
  const theProducts = req.monkMusic.products
  const productCategoryTitle = req.monkMusic.category[0]['category_name']
  console.log(productCategoryTitle, '**#*#*#*#*#*#* CHECK THIS OUT!!')
  db.getCategoryList()
  .then((lists)=>{ 
    res.render('products_page', {theProducts:theProducts, categoryTitle: productCategoryTitle})
    }) 
  })

  app.param('products_id', function (req, res, nextFn, products_id) {
       db.getItem(products_id)
       .then((item)=> {
       req.monkMusic = req.monkMusic || {}
       req.monkMusic.item = item
       console.log('******* THIS IS THE PRODUCTS *******')
       console.log(item, '*****HEEEEYYYYYYYYYYYYYYY')
       nextFn()
     })
     .catch((err)=> {
       console.log('AARHHHHHH DIDNT WORK', err)
       res.status(404).send('error_page')
     })
   })
   
   app.get('/category/:category_id/:products_id', isLoggedIn,function (req, res) {
     const theItem = req.monkMusic.item
     console.log(theItem, '**#*#*#*#*#*#* getItem PROMISE')
     db.getProductsList()
     .then((result)=>{ 
       res.render('item_page', {theItem:theItem})
       })
      .catch((err)=>{
       res.status(404).send('error_page')
       })
     })

const startExpressApp = () => {
  app.listen(port, () => {
    console.log('express is listening on port ' + port)
  })
}

function bootupSequenceFailed (err) {
  console.error ('Uh Ohh... could not connect to the database!:', err)
  console.error ('Goodbye!')
  process.exit(1)
}

function fetchCategoryList () {
  db.getCategoryList()
  .then((lists)=>{

  })
}

function fetchProductsList () {
  db.getProductsList()
  .then((products)=>{
    console.log (products)
  })
}

// Global kickoff point
db.connect()
  .then(startExpressApp)
  .then(fetchProductsList)
  .then(fetchCategoryList)
 
  .then(()=> {
    console.log ('You connected to the database!')
    })
  .catch(bootupSequenceFailed)
