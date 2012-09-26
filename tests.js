//Globals
var siri;

//BACKEND TESTS
module("Backend", {
  setup: function() {
    siri = new Alisiri();
  }, teardown: function() {
    siri = null;
  }
});

test( "Should connect to database", function() {
  siri.connectToDatabase(function(data){
	console.log("XmlEncoding = " + data.xmlEncoding);
  });
	ok( true, "Para verificar se o teste funcionou, checar no console se o xmlEncoding está retornando correto" );
});

test( "Should get initial phrase", function(){
  var ini = siri.getInitialPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>GOSANTOS</initial><final>Tchau, ate mais</final>');
  equal(ini, "GOSANTOS", "Teste funcionando");
});

test( "Should get undefined as initial phrase, when it is not in the database", function(){
  var ini = siri.getInitialPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><final>Tchau, ate mais</final>');
  equal(ini, undefined, "Teste funcionando");
});

test( "Should get final phrase", function(){
  var ini = siri.getFinalPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>GOSANTOS</initial><final>Tchau, ate mais</final>');
  equal(ini, "Tchau, ate mais", "Teste funcionando");
});

test( "Should get undefined as final phrase, when it is not in the database", function(){
  var ini = siri.getFinalPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>Hello</initial>');
  equal(ini, undefined, "Teste funcionando");
});

test( "Should see that the phrase is in the quit list", function(){
  var isInQuitList = siri.CheckIfIsQuitPhrase("Adeus", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Ola, como vai voce?</initial><final>Tchau, ate mais</final><quit><add text="Adeus"/><add text="Ate logo"/></quit></brain>');
  ok(isInQuitList, "Teste funcionando");
});

test( "Should see that the phrase is NOT in the quit list", function(){
  var isInQuitList = siri.CheckIfIsQuitPhrase("Jantsch", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Ola, como vai voce?</initial><final>Tchau, ate mais</final><quit><add text="Adeus"/><add text="Ate logo"/></quit></brain>');
  equal(isInQuitList, false, "Teste funcionando");
});
