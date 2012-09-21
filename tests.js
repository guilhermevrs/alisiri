module("GUI");
var x = 1;
test( "should execute callback", function() {
  var siri = new Alisiri();
  siri.connectToDatabase(function(){x=3});
  equal( 3,x, "Precisa, agora, conectar na database via ajax e retornar o xml" );
});
