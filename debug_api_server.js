const express = require('express')
const app = express()
const port = 3999

app.use('/api',(req, res, next) => {
    const headers = req.headers
    setImmediate(() => console.log(headers))
    res.setHeader('content-type','application/json')
    res.send(headers)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })