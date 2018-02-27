"use strict";

function loginMiddleware(ctx) {
    let path = location.pathname;
    let user = store.get('user');

    if (user == undefined && !(path.startsWith('/login') || path.startsWith('/register'))) {
        page.redirect('/login');
    }
}

page('*', function (ctx, next) {
    loginMiddleware(ctx);
    next();
});