const express = require('express');
const http = require('http');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const { logger } = require('../app/utils/logger');
const { errorHandler } = require('../app/middlewares/errorHandler');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const dbconnection = require('../app/config/db.config')
const cors = require('cors')
const { router } = require('../app/module/routes')
class System {
    configure = (app) => {
        dotenv.config()
        app.use(
            cors({
                credentials: true,
            })
        )
        app.use(express.static(__dirname + '/public'))
        app.use(helmet())
        app.use(compression())
        app.use(morgan('dev'))
        app.use(express.json())
        app.use(cookieParser())
        app.use(express.urlencoded({ extended: true }))
        app.use('/api/v1', router) // All the routes
        app.use(errorHandler)
    }

    start = async (server) => {
        // uncomment once env has been added
        const port = process.env.APP_PORT
        console.log(port);
        await this.connectToDb().then(async () => {

            await server.listen(port, () => {
                logger.info('----------------------------------------------------------');
                logger.info(`⚡️[Server]: Server is running on ${port}`);
                logger.info('Time : ' + new Date());
                logger.info('----------------------------------------------------------');
            });
        }).catch((err) => {
            console.log(err);
            // throw new Error(err.message)
        })
    }
    connectToDb = async () => {
        await dbconnection();
    }


}

module.exports = new System()