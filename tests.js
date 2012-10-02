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

test( "Should get a array of possible keys in the right order", function(){
  var listKey = new Array();
  listKey = siri.GetPossibleKeys("Isto é Chaves", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Ola, como vai voce?</initial><final>Tchau, ate mais</final><keys><add key="Chaves" decomp="*" order="5"><reassemb text="r1"/><reassemb text="r2"/></add><add key="Chaves" decomp="* isto *" order="9"><reassemb text="r3"/><reassemb text="r4"/></add><add key="madruga" decomp="*" order="1"><reassemb text="r5"/><reassemb text="r6"/></add></keys></brain>');
  equal(2,listKey.length, "Returns the number of possible keys, desconsidering the decomp property");
  equal(9,listKey[0].order, "Returns the keys within the right order");
});

test( "Should create some regex", function(){
  var p1 = "* this *",
	  p2 = "this *",
	  p3 = "* this",
	  p4 = "* this is a test *";
  var d1 = "/\\bthis\\b/gi",
	  d2 = "/^this/gi",
	  d3 = "/this$/gi",
	  d4 = "/\\bthis is a test\\b/gi";
  equal(siri.ConvertToRegExp(p1).toString(), d1, "First phrase successfully converted");
  equal(siri.ConvertToRegExp(p2).toString(), d2, "Second phrase successfully converted");
  equal(siri.ConvertToRegExp(p3).toString(), d3, "Third phrase successfully converted");
  equal(siri.ConvertToRegExp(p4).toString(), d4, "Forth phrase successfully converted");
});

test( "Should verify if the decomp is valid or not", function(){
  var p1 = "Isto é um teste de performance",
	  p2 = "Carminha vai pegar tufão",
	  p3 = "Google nasa twitter quero churros onde tem";
  var d1 = "* teste de *",
	  d2 = "carminha vai *",
	  d3 = "* quero churros onde tem";
  ok(siri.VerifyDecomp(p1,d1), "First phrase matches with the first decomp");
  ok(siri.VerifyDecomp(p2,d2), "Second phrase matches with the second decomp");
  ok(siri.VerifyDecomp(p3,d3), "Third phrase matches with the third decomp");
  
});

test( "Should get the first right key, considering the decomp property", function(){
  var listKey = new Array();
  listKey = siri.GetPossibleKeysWithDecomp("Isto e Chaves", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Ola, como vai voce?</initial><final>Tchau, ate mais</final><keys><add key="Chaves" decomp="*" order="5"><reassemb text="r1"/><reassemb text="r2"/></add><add key="Chaves" decomp="* isto e *" order="9"><reassemb text="r3"/><reassemb text="r4"/></add><add key="madruga" decomp="*" order="1"><reassemb text="r5"/><reassemb text="r6"/></add></keys></brain>');
  equal("chaves",listKey.key, "Returns the right key");
  equal(9,listKey.order, "returns the right order");
  equal("* isto e *",listKey.decomp, "returns the right decomp");
});

//************************************MODULE GUI
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
