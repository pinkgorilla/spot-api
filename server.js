var restify = require('restify');
restify.CORS.ALLOW_HEADERS.push('authorization');

var server = restify.createServer();

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS({
    headers: ['Content-Disposition']
}));

var passport = require('passport');
server.use(passport.initialize());

server.use(function(request, response, next) {
    var query = request.query;
    try {
        query.order = !query.order ? {} : JSON.parse(query.order);
    }
    catch (e) {
        query.order = {};
    }
    try {
        query.filter = !query.filter ? {} : JSON.parse(query.filter);
    }
    catch (e) {
        query.filter = {};
    }

    request.queryInfo = query;
    next();
});

var getV1SpotRouter = require('./src/routers/v1/spot-router');
var spotRouter = getV1SpotRouter();
var v1SpotRouter = getV1SpotRouter();

spotRouter.applyRoutes(server, "/spots");
v1SpotRouter.applyRoutes(server, "/v1/spots");

server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`);
