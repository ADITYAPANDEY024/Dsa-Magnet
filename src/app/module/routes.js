const express = require('express');
const router = express.Router();
const user = require('./user/user.routes')


// use all the routes used below here

router.use('/user', user)




// do not add any routes below this
router.use('*', (req, res) => {
    const allAvailableRoutes = [
        '/user'
    ]
    res.status(404).json({ error: 'Invalid route', availableRoutes })
})
module.exports = { router };
// ************************************XXXXXXXXXXXXXXXXXXXXXXXX************************************

