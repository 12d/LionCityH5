// require('./check-versions')()
//
// var config = require('../config')
// if (!process.env.NODE_ENV) {
//   process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
// }
//
// var opn = require('opn')
// var path = require('path')
// var express = require('express')
// var webpack = require('webpack')
// var proxyMiddleware = require('http-proxy-middleware')
// var webpackConfig = require('./webpack.seo.conf')
//
// // default port where dev server listens for incoming traffic
// var port = process.env.PORT || config.dev.port
// // automatically open browser, if not set will be false
// var autoOpenBrowser = !!config.dev.autoOpenBrowser
// // Define HTTP proxies to your custom API backend
// // https://github.com/chimurai/http-proxy-middleware
// var proxyTable = config.dev.proxyTable
//
// var app = express()
// var compiler = webpack(webpackConfig)
//
// var devMiddleware = require('webpack-dev-middleware')(compiler, {
//   publicPath: webpackConfig.output.publicPath,
//   quiet: true
// })
//
// var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//   log: false,
//   heartbeat: 2000
// })
// // force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })
//
// // proxy api requests
// Object.keys(proxyTable).forEach(function (context) {
//   var options = proxyTable[context]
//   if (typeof options === 'string') {
//     options = { target: options }
//   }
//   app.use(proxyMiddleware(options.filter || context, options))
// })
//
// // handle fallback for HTML5 history API
// app.use(require('connect-history-api-fallback')())
//
// // serve webpack bundle output
// app.use(devMiddleware)
//
// // enable hot-reload and state-preserving
// // compilation error display
// app.use(hotMiddleware)
//
// // serve pure static assets
// var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// app.use(staticPath, express.static('./static'))
//
// var uri = 'http://localhost:' + port
//
// var _resolve
// var readyPromise = new Promise(resolve => {
//   _resolve = resolve
// })
//
// console.log('> Starting dev server...')
// devMiddleware.waitUntilValid(() => {
//   console.log('> Listening at ' + uri + '\n')
//   // when env is testing, don't need open it
//   if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
//     opn(uri)
//   }
//   _resolve()
// })
//
// var server = app.listen(port)
//
// module.exports = {
//   ready: readyPromise,
//   close: () => {
//     server.close()
//   }
// }

const url = require('url');
const path = require('path');
const fs = require('fs');
// const Vue = require('vue')
const server = require('express')()


// const filePath = path.join(__dirname, '../dist/server/seo.js')
// const code = fs.readFileSync(filePath, 'utf8');
//
// const renderer = require('vue-server-renderer').createBundleRenderer(code, {
//   runInNewContext: false,
//   template: <!--vue-ssr-outlet-->'
// })
// console.log(renderer, 'renderer')
const templateFilePath = path.join(__dirname, '../dist/index.html')
const templateStr = fs.readFileSync(templateFilePath, 'utf8');
const renderer = require('vue-server-renderer').createRenderer({
  template: templateStr
});
const createApp  = require('../dist/server/seo').default

//添加MIME类型
var MIME_TYPE = {
  "css": "text/css",
  "gif": "image/gif",
  "html": "text/html",
  "ico": "image/x-icon",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "text/javascript",
  "json": "application/json",
  "pdf": "application/pdf",
  "png": "image/png",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tiff": "image/tiff",
  "txt": "text/plain",
  "wav": "audio/x-wav",
  "wma": "audio/x-ms-wma",
  "wmv": "video/x-ms-wmv",
  "xml": "text/xml"
};

//gzip开启压缩
// server.use(compress());
server.get('/static/*', (req, res) => {
  var request = req;
  var response = res;
  var pathname = url.parse(request.url).pathname;
  var realPath = path.join(process.cwd(),'dist',pathname);

  var ext = path.extname(realPath);
  ext = ext?ext.slice(1) : 'unknown';
  var contentType = MIME_TYPE[ext] || "text/plain";

  fs.exists(realPath, function (exists) {

    if (!exists) {
      console.log("This request URL " + pathname + " was not found on this server.")
      response.writeHead(404, {'Content-Type': 'text/plain'});

      response.write("This request URL " + pathname + " was not found on this server.");

      response.end();

    } else {
      var fileStream = fs.createReadStream(realPath);
      fileStream.on('data', (chunk) => {
        response.write(chunk);
      })
      fileStream.on('end', (chunk) => {
        response.end();
      })
      // fs.readFile(realPath, "binary", function(err, file) {
      //
      //   if (err) {
      //
      //     response.writeHead(500, {'Content-Type': 'text/plain'});
      //
      //     response.end(err);
      //
      //   } else {
      //
      //     response.writeHead(200, {'Content-Type': contentType});
      //
      //     response.write(file, "binary");
      //     response.end();
      //
      //   }
      //
      // });

    }

  });
})
server.get('*', (req, res) => {
  const context = {
    title: '文渊狮城',
    url: req.url
  }
  res.write(templateStr)
  // console.log(createApp(context).app,'createApp(context).app')
  createApp(context).then(app => {
    /* use renderToString
    renderer.renderToString(app, context, (err, html) => {
      if (err) {
        res.status(500).end('Internal Server Error')
        return
      }
      res.end(html, 'utf-8')
    })
    */
    /* use renderToStream */
    let renderStream = renderer.renderToStream(app, context)
    // renderStream.once('data', chunk => {
    //   res.write(chunk.toString()+'//head render');
    // })
    renderStream.on('data', chunk => {
      res.write(chunk.toString());
    })
    renderStream.on('end', chunk => {
      res.end();
    })
  }).catch(err=>console.log(err))

})
const port  = 1237;
server.listen(port)/**
 * @author xuweichen@meitu.io
 * @date 2017/8/14
 */
console.log('server listen at ',port);
