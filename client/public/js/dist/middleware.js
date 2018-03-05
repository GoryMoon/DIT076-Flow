"use strict";

function loginMiddleware(ctx) {
    let path = location.pathname;
    let user = store.get('user');

    if (user === undefined && !(ctx.path.startsWith('/login') || ctx.path.startsWith('/register'))) {
        page.redirect('/login');
    } else if (user !== undefined && (ctx.path.startsWith('/login') || ctx.path.startsWith('/register'))) {
        page.redirect('/');
    }
}

page('*', function (ctx, next) {
    loginMiddleware(ctx);
    next();
});