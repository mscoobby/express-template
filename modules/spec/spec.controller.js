'use strict';

module.exports = {
    home: (req, res, next) => {
        res.render('index', { title: 'Express Template' });
    }
};
