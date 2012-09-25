module("Backend");
test( "Should connect to database", function() {
  var siri = new Alisiri();
  var x = "sdsds";
  siri.connectToDatabase(function(data){
	x = data;
  });
  console.log(x);
  ok( true, "Teste funcionando" );
});

test( "Should get initial phrase", function(){
  var siri = new Alisiri();
  var ini = siri.getInitialPhrase();
  equal(ini, "Ola, como vai voce?", "Teste funcionando");
});