"use strict";

page('*', function (ctx, next) {
    document.title = "Flow - Not Found"
    $('#content').html("<h1>Not Found</h1>");
    next();
});