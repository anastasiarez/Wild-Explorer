const express = require('express')
const router = express.Router()

// middleware that is specific to this router
// router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route
router.get('/', (req, res) => {

  console.log("inside test router get/");
  res.json([{id:1}, {id:2}]);
})
// define the about route
router.post('/', (req, res) => {

  console.log("inside test router post/");
  res.json({id:req.body.id});
})

module.exports = router