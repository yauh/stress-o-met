Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', function(){
    this.render('home');
});

Router.route('/about', function(){
    this.render('about');
});

Router.route('/methods', function(){
    this.render('methods');
});

Router.route('/mongodb', function(){
    this.render('mongodb');
});