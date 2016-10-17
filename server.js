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
    query.order = !query.order ? {} : JSON.parse(query.order);
    query.filter = !query.filter ? {} : JSON.parse(query.filter);
    request.queryInfo = query;
    next();
});

var spotRouter = require('./src/routers/v1/spot-router');
spotRouter.applyRoutes(server, "/spots");
spotRouter.applyRoutes(server, "/v1/spots");

server.listen(process.env.PORT, process.env.IP);
console.log(`server created at ${process.env.IP}:${process.env.PORT}`)