const express = require('express')
const app = express()
const port = 3999

app.use('/api',(req, res, next) => {
    process.stdout.write(JSON.stringify(req.headers) + '\n')
    res.setHeader('content-type','application/json')
    res.send(req.headers)
    next()
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })