(function($) {
    $.fn.getAttributes = function() {
        var attributes = {}; 

        if( this.length ) {
            $.each( this[0].attributes, function( index, attr ) {
            	attributes[ attr.name ] = attr.value; 
            } ); 
        }

        return attributes;
    };
    $.fn.setAttributes = function(_attributeArr) {
    	var tempArr = _attributeArr;
        for(var i in tempArr){
        	$(this).attr(i, tempArr[i]);
        }
    };
})(jQuery);