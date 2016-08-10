#!/usr/bin/env node

// uncomment the following line to demonstrate that test works
// throw new Error('bad handler')

var tap = require('../../')
var tapParser = require('tap-parser')

var eventName = process.argv[2]
var testFile = process.argv[3]

var firstCall = true
var parser = tapParser()
parser.on(eventName, function (data) {
  if (firstCall) {
    firstCall = false
    throw new Error('bad handler')
  }
})

tap.pipe(parser)
require(testFile)
