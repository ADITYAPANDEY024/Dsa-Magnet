const express = require('express');
const app = express();
const system = require('./src/system/system')
const http = require('http')
const server = http.createServer(app);
const { errorHandler } = require('./src/app/middlewares/errorHandler')




system.configure(app)

system.start(server)

app.get('/', async (req, res, next) => {
    try {
        res.send('Express + JavaScript Server')
    } catch (error) {
        next(err)
    }
})
app.use(errorHandler);
['uncaughtException', 'unhandledRejection'].forEach((event) =>
    process.on(event, (err) => {
        console.error(`Something bad happend! event: ${event}, msg: ${err.stack || err}`)
    })
)



