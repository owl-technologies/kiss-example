#!/usr/bin/env node --experimental-specifier-resolution=node

// import * as dotenv from "dotenv";
import cors from "cors";
import { EventEmitter } from 'events';
import express, { Request, Response } from "express";
import { KissServer } from "kiss-framework";
import { config } from "./config.js";


export function tictoc(msg = '') {
  const tic = {start: new Date().getTime(), msg}
  return {
      toc: (msg = '') => {
          const toc = new Date().getTime();
          const interval = toc - tic.start;
          console.log(`${interval / 1000.0}s ${tic.msg} ${msg}`);
          return interval
      }
  }
}

const logger = (req: Request, res: Response, next: Function) => {
  const tic = tictoc()
  next();
  const clientIp = req.ip;
  //signale.debug("%s %s %s", clientIp, req.method, req.url, req.path);
  tic.toc(`${clientIp}, ${req.method}, ${req.url}, ${req.path} status: ${res.statusCode}`)
};


// clear console, quite nice when nodemon is running
// console.clear();

// configure Event Emitter
EventEmitter.defaultMaxListeners = 300;

// configure express
const app = express();

// configure cors
app.use(cors());

// configure body parser
app.use(express.json()); // for parsing application/json

app.use(logger);

// app.use(express.static(config.staticRoute))

new KissServer(app, config);
