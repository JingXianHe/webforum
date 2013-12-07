(function($, scope, undefined) {
    scope.ssItemParser = NClass.extend({
        parse: function(name, data){
            var o = {};
            o[name] = data;
            return o;
        },
        render: function(node, data){
            return node;
        }
    });
})(njQuery, window);