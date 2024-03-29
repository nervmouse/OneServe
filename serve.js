#!/usr/bin/env node
const express = require('express')
const proxy = require('express-http-proxy')
const child_process = require('child_process')
const path = require('path')
const rootPath = path.join(__dirname, './')
const exec = function (cmd, options = {}) {
  return new Promise((res, rej) => {
    console.log('[cmd] ' + cmd)
    child_process.exec(cmd, options, (error, stdout, stderr) => {
      if (stderr) {
        //rej(stderr)
        console.error('[cmd stderr]', stderr)
      }
      if (error) {
        //rej(error)
        console.error('[cmd err]', error)
      }
      res(stdout)
      console.log(stdout)
    })
  })
}
const app = express()
let packageInfo={}
try{
  packageInfo=require('./package.json')
}catch(err){
  console.error(err)
}
const resolve = path.resolve
const fs=require('fs')
let cfg={
  port:8000,
  api_url:'http://api.gov.tw',
  api_uri:'/api',
  local_api_uri:'/api',
  mode:'hash',  //history or hash
  root_dir:'./spa',
  index_path:null, // for hostory mode,
  auto_update:true,
  console_title: packageInfo.name
}

try{
  Object.assign(cfg,JSON.parse(fs.readFileSync('./serve.cfg.json')))
}catch(e){
  console.log(e)
  console.log("No config : serve.cfg.json")
}
if (process.env.PORT){
  cfg.port=process.env.PORT
}
if (process.env.API_URL){
  cfg.api_url=process.env.API_URL
}

if (process.env.API_URI){
  cfg.api_uri=process.env.API_URI
}

if (process.env.LOCAL_API_URI) {
  cfg.local_api_uri = process.env.LOCAL_API_URI
}
if (process.env.MODE){
  cfg.mode=process.env.MODE
}

if (process.env.ROOT_DIR){
  cfg.root_dir=process.env.ROOT_DIR
}

if (process.env.INDEX_PATH){
  cfg.index_path=process.env.INDEX_PATH
}

if (process.env.CONSOLE_TITLE) {
  cfg.console_title = process.env.CONSOLE_TITLE
}

if (cfg.root_dir && cfg.root_dir[0]==='.'){
	cfg.root_dir=path.join(process.cwd(),cfg.root_dir)
}

process.title = cfg.console_title
app.use(express.static(cfg.root_dir))

if (cfg.api_url){
  if (!cfg.local_api_uri){
    cfg.local_api_uri = cfg.api_uri
  }
  app.use(cfg.local_api_uri, proxy((cfg.api_url ),{
    proxyReqPathResolver: function (req) {
      console.log(req.url)
      return cfg.api_uri+req.url
    },
    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      // recieves an Object of headers, returns an Object of headers.
      
      proxyReqOpts.headers['X-Forwarded-For']=proxyReqOpts.headers['x-forwarded-for'] || srcReq.ip
      proxyReqOpts.headers['x-real-ip']=proxyReqOpts.headers['x-real-ip'] || srcReq.ip

      return proxyReqOpts;
    }
  }))
}
if(cfg.auto_update){
  app.use('/_oneserve',(req,res,next)=>{
    console.log(req.url)
    if (req.url==='/update'){
      exec('git pull', {
        cwd: rootPath
      })
    }
    res.end(req.url)
    
  })
}


if (cfg.mode==='history'){
  if (!cfg.index_path){
    cfg.index_path=cfg.root_dir+'/index.html'
  }
  app.all("*", (_req, res) => {
    try {
      res.sendFile(resolve(cfg.index_path))
    } catch (error) {
      console.log(error)
      res.json({ success: false, message: "Something went wrong" });
    }
  })
}

console.log('OneServ ver.'+packageInfo.version)
console.dir(cfg)
app.listen(cfg.port, () => console.log(`http://127.0.0.1:${cfg.port}`))