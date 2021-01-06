#!/usr/bin/env node
const express = require('express')
const proxy = require('express-http-proxy')
const app = express()

const path=require('path')
const resolve = path.resolve
const fs=require('fs')
let cfg={
  port:8000,
  api_url:'http://note.wanfang.gov.tw:3000',
  api_uri:'/api',
  mode:'history',  //history
  root_dir:'./dist/spa',
  index_path:null
}

try{
  Object.assign(cfg,JSON.parse(fs.readFileSync('./serve.cfg.json')))
}catch(e){

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
if (process.env.MODE){
  cfg.mode=process.env.MODE
}

if (process.env.ROOT_DIR){
  cfg.root_dir=process.env.ROOT_DIR
}

if (process.env.INDEX_PATH){
  cfg.index_path=process.env.INDEX_PATH
}

if (cfg.root_dir && cfg.root_dir[0]==='.'){
	cfg.root_dir=path.join(process.cwd(),cfg.root_dir)
}

app.use(express.static(cfg.root_dir))

if (cfg.api_url){
  app.use(cfg.api_uri, proxy((cfg.api_url ),{
    proxyReqPathResolver: function (req) {
      console.log(req.url)
      return cfg.api_uri+req.url
    }
  }))
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


app.listen(cfg.port, () => console.log(`http://127.0.0.1:${cfg.port}`))