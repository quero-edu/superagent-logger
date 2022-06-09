var url = require('url');
var querystring = require('querystring');
var superagent = require('superagent');

exports = module.exports = function (options) {
  if (!options) options = {};
  if (options instanceof superagent.Request)
    return attachSuperagentLogger({}, options);

  return attachSuperagentLogger.bind(null, options);
};

function attachSuperagentLogger(options, req) {
  var start = new Date().getTime();
  var timestamp = new Date().toISOString();

  var uri = url.parse(req.url);
  var method = req.method;

  if (options.outgoing) {
    console.log('%s %s %s %s %s %s',
      rightPad(uri.protocol.toUpperCase().replace(/[^\w]/g, ''), 5),

      rightPad(method.toUpperCase(), 'delete'.length),
      options.timestamp ? '[' + timestamp + ']' : '',
      ' - ',
      uri.href + (req.qs ? '' : '?' + querystring.encode(req.qs)),
      '(pending)'
    );
  }

  function log(res) {
    var now = new Date().getTime();
    var elapsed = now - start;

    var st = res.status;


    console.log('%s %s %s %s %s %s',
      rightPad(uri.protocol.toUpperCase().replace(/[^\w]/g, ''), 5),
      rightPad(method.toUpperCase(), 'delete'.length),
      options.timestamp ? '[' + timestamp + ']' : '',
      st,
      uri.href + (req.qs ? '' : '?' + querystring.encode(req.qs)),
      '(' +
      (elapsed + 'ms') +
      ')'
    );
  }

  req.on('response', log);
  req.on('error', log);
}

function colorForSpeed(ms) {
  if (ms < 200) {
    return 'green';
  } else if (ms < 1000) {
    return 'gray';
  } else if (ms < 5000) {
    return 'yellow';
  } else {
    return 'red';
  }
}

function rightPad(str, len) {
  var l = str.length;
  if (l < len) {
    for (var i = 0, n = len - l; i < n; i++) {
      str += ' ';
    }
  }
  return str;
}
