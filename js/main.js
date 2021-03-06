require.config({
  'baseUrl' : 'js',
  'paths' : {
    'jquery' : '../components/jquery/jquery.min',
    'underscore' : '../components/underscore/underscore-min',
    'backbone' : '../components/backbone/backbone-min'
  },
  'shim' : {
    'jquery' : {
      'exports' : '$'
    },

    'underscore' : {
      'exports' : '_'
    },
    'backbone' : {
      'deps' : ['underscore', 'jquery'],
      'exports' : 'Backbone'
    }
  }
});

require([], function() {

});