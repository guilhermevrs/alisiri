module("GUI");
var x = "";
test( "Should connect to database", function() {
  var siri = new Alisiri();
  siri.connectToDatabase(function(xml){x=xml});
  ok( x.indexOf("<xml") != -1, "Teste funcionando" );
});
