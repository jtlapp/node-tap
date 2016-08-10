var stream = require('stream')
var spawn = require('child_process').spawn;

var tap = require('../')

var testFileDir = __dirname + '/fixture'
var okFile = testFileDir + '/pipe-ok.js'
var notOkFile = testFileDir + '/pipe-not-ok.js'

var expectedStderr = /Error: bad handler/

testThrowingHandler(
  'comment handler throws exception',
  'comment',
  okFile
)

testThrowingHandler(
  'complete handler throws exception',
  'complete',
  okFile
)

testThrowingHandler(
  'assert handler throws exception when ok',
  'assert',
  okFile
)

testThrowingHandler(
  'assert handler throws exception when not ok',
  'assert',
  notOkFile
)

function testThrowingHandler (testName, event, tapFile) {
  tap.test(testName, function (t) {
    var writable = new stream.Writable()
    var chunks = []
    writable._write = function (chunk) {
      chunks.push(chunk)
    }

    var cmd = __dirname + '/fixtures/pipe-throws.js'
    var ps = spawn(cmd, [event, tapFile], { cwd: __dirname })
    ps.stderr.pipe(writable)
    ps.on('exit', function (code) {
      var stderr = Buffer.concat(chunks).toString()
      if (expectedStderr.test(stderr))
        t.pass('got expected exception')
      else
        t.fail('did not get expected exception')
      t.equal(code, 7, 'expecting error exit code')
      t.end()
    })
  })
}
