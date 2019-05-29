const express = require('express');
const router = express.Router();

/* Import sub routers */
const usersRouter = require('./users');

/* Use sub routers */
router.use('/users', usersRouter);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express Template' });
});

module.exports = router;
