import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import { Express } from "express-serve-static-core";

export async function createServer(): Promise<Express> {
  const sess = null
  const server = express()
  server.set('trust proxy', true)
  server.use(bodyParser.json())
  server.use(session({
    secret: 'usemetry-demo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  server.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
  })

  server.get('/', (req, res) => {

    if(req.session) {
      console.log(req.connection.remoteAddress);
      console.log(req.ip);
      console.log(req.session);
    }

    res.send({
      sessionId : req.sessionID,
      connection: {
        server: req.connection.remoteAddress,
        client: req.ip
      }
    })
  })

  server.post('/', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods', 'GET,POST");

    if(req.session) {
      console.log(req.connection.remoteAddress);
      console.log(req.sessionID);
    }

    res.send({
      sessionId : req.sessionID,
      connection: req.connection.remoteAddress
    })
  })

  return server
}
