// base on css line-height : 10px
// php.rcena@gmail.com
(function() {
tinymce.create('tinymce.plugins.LineHeight', {    
    
   init : function(ed, url) {
   var t = this;
   
	 ed.addCommand('mceSetLineHeight', function(ui, v)
   {
       
  		if (e = ed.selection.getNode())
      { 
        
        if ( e.hasChildNodes() )
        {
           var c = e.childNodes;
           for ( var i = 0; i < c.length; i++ ) 
           {
              
              if ( c[i].hasChildNodes() )
              {
                  var c1 = c[i].childNodes;
                  for ( var i1 = 0; i1 < c1.length; i1++ ) {
                      if ( /^(SPAN)$/i.test(c1[i1].nodeName) )
                      {
                        if ( c1[i1] ) {                        
                        ed.dom.setStyle( c1[i1], 'line-height', v );
                        }                                    
                      }
                  }
                      
                  if ( /^(SPAN)$/i.test(c[i].nodeName) )
                  {
                    ed.dom.setStyle( c[i], 'line-height', v );                    
                  }                  
                  
                                    
              } else {
              
              if ( /^(SPAN)$/i.test(c[i].nodeName) )
              {
                 ed.dom.setStyle( c[i], 'line-height', v );                    
              }
              
              }
           }
           
        } else {
        
        ed.dom.setStyle( e, 'line-height', v );
        
        }
        
  			ed.execCommand('mceRepaint');
  		}
	 });
   
   },
   createControl: function(n, cm) {
        var ed = tinymce;
        switch (n) {
            case 'lineheight':            
                
                var mlb = cm.createListBox('lineheight', {
                     title : 'Line Height',
                     onselect : function(v) {
                     ed.execCommand('mceSetLineHeight', false, v);                         
                     }
                });
                
                var lh = [0, 8, 10, 16, 20, 26, 30, 36, 40, 46, 50, 60, 70];
                //default
                mlb.add( 'Default', 'normal' );
                //list
                for( var r = 0; r < lh.length; r++  ) {
                mlb.add( lh[r] + 'px',  lh[r] + 'px' );
                }
                
                return mlb;                               
        }

        return null;
    }
  });

// Register plugin with a short name
tinymce.PluginManager.add('lineheight', tinymce.plugins.LineHeight);
})();