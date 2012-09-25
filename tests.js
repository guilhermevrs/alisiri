module("Backend");
test( "Should connect to database", function() {
  var siri = new Alisiri();
  siri.connectToDatabase(function(data){
	console.log(data);
  });
  ok( true, "Teste funcionando" );
});

test( "Should get initial phrase", function(){
  var siri = new Alisiri();
  var ini = siri.getInitialPhrase();
  equal(ini, "Ola, como vai voce?", "Teste funcionando");
});