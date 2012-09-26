//Globals
var siri;
var siriGui;

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

module("GUI", {
  setup: function() {
    siri = new Alisiri();
	siriGui = new AlisiriGui();
	$("#container").empty();
  }, teardown: function() {
    siri = null;
	siriGui = null;
	$("#container").empty();
  }
});

test( "Should insert a new div with text", function(){
	var divContainer = $("#container");
	equal(divContainer.html(), "", "Container vazio antes do método");
	siriGui.AddText("text of the message", "css-class");
	equal(divContainer.html(), '<div class="css-class">text of the message</div>', "Container com mensagem da alisiri depois do método");	
});

test( "Should insert a new div with text of alisiri text", function(){
	var divContainer = $("#container");
	equal(divContainer.html(), "", "Container vazio antes do método");
	siriGui.AddAlisiriText("text of the message");
	equal(divContainer.html(), '<div class="alisiri-text">text of the message</div>', "Container com mensagem da alisiri depois do método");	
});

test( "Should insert a new div with text of user text", function(){
	var divContainer = $("#container");
	equal(divContainer.html(), "", "Container vazio antes do método");
	siriGui.AddUserText("text of the message");
	equal(divContainer.html(), '<div class="user-text">text of the message</div>', "Container com mensagem da alisiri depois do método");	
});

test( "Should get the user's message", function(){
	var x = siriGui.GetUserMessage();
	equal(x,"","Mensagem vazia antes de ser populada");
	$("#txt-sender").val("Mensagem do usuario");
	x = siriGui.GetUserMessage();
	equal(x,"Mensagem do usuario","Mensagem certa depois de ser populada");
});

test( "Should insert a new div with the text of the user everytime he/she hits submit", function(){
var event,
  $button = $("#btn-sender"),
  divContainer = $("#container");
  // trigger event
  event = $.Event( "click" );
  $("#txt-sender").val("Mensagem do usuario");
  
  equal(divContainer.html(), "", "Container vazio antes do submit");
  $button.trigger( event );
  equal(divContainer.html(), '<div class="user-text">Mensagem do usuario</div>', "Container com mensagem da alisiri depois do submit");	
});