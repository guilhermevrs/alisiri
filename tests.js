module("Backend");
test( "Should connect to database", function() {
  var siri = new Alisiri();
  siri.connectToDatabase(function(data){
	console.log(data.contentType);
  });
	ok( true, "Para verificar se o teste funcionou, checar no console se o contentType" );
});

test( "Should get initial phrase", function(){
  var siri = new Alisiri();
  var ini = siri.getInitialPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>GOSANTOS</initial><final>Tchau, ate mais</final>');
  equal(ini, "GOSANTOS", "Teste funcionando");
});

test( "Should get undefined as initial phrase, when it is not in the database", function(){
  var siri = new Alisiri();
  var ini = siri.getInitialPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><final>Tchau, ate mais</final>');
  equal(ini, undefined, "Teste funcionando");
});

test( "Should get final phrase", function(){
  var siri = new Alisiri();
  var ini = siri.getFinalPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>GOSANTOS</initial><final>Tchau, ate mais</final>');
  equal(ini, "Tchau, ate mais", "Teste funcionando");
});

test( "Should get undefined as final phrase, when it is not in the database", function(){
  var siri = new Alisiri();
  var ini = siri.getFinalPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>Hello</initial>');
  equal(ini, undefined, "Teste funcionando");
});
