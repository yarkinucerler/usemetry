import express from 'express'
import bodyParser from 'body-parser'
import { Express } from "express-serve-static-core"
import * as crypto from "crypto";

export async function createServer(): Promise<Express> {
  const server = express()
  server.set('trust proxy', true)
  server.use(bodyParser.json())

  server.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
  })

  server.get('/', (req, res, next) => {
    const uuid = req.cookies || crypto.randomBytes(16).toString("hex")
    res.cookie('__um_uuid', uuid)
    res.send({
      userAgent: req.header('user-agent'),
      uuid: uuid
    })

    next()
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
      connection: req.ip
    })
  })

  server.post('/check', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods', 'GET,POST,PUT");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log(req.headers.cookies);
    res.send({
      userAgent: req.header('user-agent'),
      uuid: req.cookies
    })
  })

  return server
}
