//Globals
var siri;
var siriGui;

//BACKEND TESTS
module("Backend", {
  setup: function() {
    //siri = new Alisiri();
  }, teardown: function() {
    //siri = null;
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
  equal(ini, "", "Teste funcionando");
});

test( "Should get final phrase", function(){
  var ini = siri.getFinalPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>GOSANTOS</initial><final>Tchau, ate mais</final>');
  equal(ini, "Tchau, ate mais", "Teste funcionando");
});

test( "Should get undefined as final phrase, when it is not in the database", function(){
  var ini = siri.getFinalPhrase('<?xml version="1.0" encoding="UTF-8"?><brain><initial>Hello</initial>');
  equal(ini, "", "Teste funcionando");
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
  listKey = siri.GetPossibleKeys("Isto é @louco", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Ola, como vai voce?</initial><final>Tchau, ate mais</final><keys><add key="@louco" decomp="*" order="5"><reassemb text="r1"/><reassemb text="r2"/></add><add key="Chaves" decomp="* isto *" order="9"><reassemb text="r3"/><reassemb text="r4"/></add><add key="madruga" decomp="*" order="1"><reassemb text="r5"/><reassemb text="r6"/></add></keys></brain>');
  equal(1,listKey.length, "Returns the number of possible keys, desconsidering the decomp property");
  equal(5,listKey[0].order, "Returns the keys within the right order");
});

test( "Should create blocks of inside regex", function(){
  var a1 = new Array('hug','hash','jock', '*');
  var a2 = new Array('hug','hash', '*', 'jock', '*');
  var a3 = new Array('hug','hash', '*', 'jock');
  var a4 = new Array('hug','hash','jock');
  equal('\\s\\b((\\w)*\\shug hash jock)|(\\shug hash jock)\\b',RecursiveRegEx(a1,0), "Should create the right block");
  equal('\\s\\b((\\w)*\\shug hash)|(\\shug hash)\\b\\s\\b((\\w)*\\sjock)|(\\sjock)\\b',RecursiveRegEx(a2,0), "Should create the right block");
  equal('\\s\\b((\\w)*\\shug hash)|(\\shug hash)\\b\\s\\b((\\w)*\\sjock)|(\\sjock)\\b$',RecursiveRegEx(a3,0), "Should create the right block");
  equal('\\s\\b((\\w)*\\shug hash jock)|(\\shug hash jock)\\b$',RecursiveRegEx(a4,0), "Should create the right block");
});

test( "Should create some regex", function(){
  var p1 = "* this *",
	  p2 = "this *",
	  p3 = "* this",
	  p4 = "* this is a test *",
	  p5 = "* everyone has * tenis *"
  var d1 = "/\\bthis\\b/gi",
	  d2 = "/^this/gi",
	  d3 = "/this$/gi",
	  d4 = "/\\bthis is a test\\b/gi",
	  d5 = "/\\beveryone has\\b\\s\\b((\\w)*\\stenis)|(\\stenis)\\b/gi";
  equal(siri.ConvertToRegExp(p1).toString(), d1, "First phrase successfully converted");
  equal(siri.ConvertToRegExp(p2).toString(), d2, "Second phrase successfully converted");
  equal(siri.ConvertToRegExp(p3).toString(), d3, "Third phrase successfully converted");
  equal(siri.ConvertToRegExp(p4).toString(), d4, "Forth phrase successfully converted");
  equal(siri.ConvertToRegExp(p5).toString(), d5, "Fifth phrase successfully converted");
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

test( "Should get a reassemb", function(){
  var key = new KeyElement();
  var r1 = new ReassembElement();
  var r2 = new ReassembElement();
  var r3 = new ReassembElement();

  r1.text = "Reassemb 1";
  r2.text = "Mais um reassemb";
  r3.text = "E outro reassemb";

  key.reassemb.push(r1);
  key.reassemb.push(r2);
  key.reassemb.push(r3);

  var resp = siri.GetRandomReassemb(key);
  ok(resp != null, "Should not be null");
});

test( "Should remove accents", function(){
  var out = removeAccents(siriGui.DefaultMessage);
  equal(out, "Desculpe, nao entendi a ultima coisa que voce disse", "returns the right phrase");
});

test("Should replace preprocessing keys", function(){
  var result = siri.ProcessorReplace("Entrada do usuario vc. q mallandro", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Sou galo</initial><final>Tchau, ate mais</final><pre><add old="vc" new="voce"/><add old="q" new="que"/></pre></brain>', "pre");
  equal(result , "Entrada do usuario voce. que mallandro", "Replaces preprocessing keys sucessfully");
  
  result = siri.ProcessorReplace("legal o q", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Sou galo</initial><final>Tchau, ate mais</final><pre><add old="vc" new="voce"/><add old="q" new="que"/></pre></brain>', "pre");
  equal(result , "legal o que", "Replaces preprocessing keys sucessfully");
  
  result = siri.ProcessorReplace("q legal", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Sou galo</initial><final>Tchau, ate mais</final><pre><add old="vc" new="voce"/><add old="q" new="que"/></pre></brain>', "pre");
  equal(result , "que legal", "Replaces preprocessing keys sucessfully");
});

test("Should preprocess user input", function(){
  var result = siri.PreProcess("Entrada do usuario vc. Q mallandro da casa", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Sou galo</initial><final>Tchau, ate mais</final><pre><add old="vc" new="voce"/><add old="q" new="que"/></pre><syns><add syn="@casa" matches="casa barraco ape moradia"/></syns></brain>');
  equal(result , "entrada do usuario voce. que mallandro da @casa", "Normalizes phrase and replaces preprocessing keys sucessfully");
  
  result = siri.PreProcess(siriGui.DefaultMessage, '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Sou galo</initial><final>Tchau, ate mais</final><pre><add old="vc" new="voce"/><add old="q" new="que"/></pre><syns><add syn="@casa" matches="casa barraco ape moradia"/></syns></brain>');
  equal(result , "desculpe, nao entendi a ultima coisa que voce disse", "Normalizes phrase and replaces preprocessing keys sucessfully");
});

test("Should add spaces before punctuation", function(){
  var result = addSpacesToPunctuation("ola, ritmo de festa!");
  equal(result , "ola , ritmo de festa !", "Adds spaces succesfully");
  
  result = addSpacesToPunctuation("a");
  equal(result , "a", "Adds spaces succesfully");
  
  result = addSpacesToPunctuation("?");
  equal(result , " ?", "Adds spaces succesfully");
  
  result = addSpacesToPunctuation("a?");
  equal(result , "a ?", "Adds spaces sucessfully");
});

test("Should remove spaces before punctuation", function(){
  var result = removeSpacesFromPunctuation("ola , ritmo de festa !");
  equal(result , "ola, ritmo de festa!", "Removes spaces succesfully");
  
  result = removeSpacesFromPunctuation("a");
  equal(result , "a", "Removes spaces succesfully");
  
  result = removeSpacesFromPunctuation(" ?");
  equal(result , "?", "Removes spaces succesfully");
  
  result = removeSpacesFromPunctuation("a ?");
  equal(result , "a?", "Removes spaces sucessfully");
});

test("Should post-process user input", function(){
  var result = siri.PostProcess("teste dpois, antes!", '<?xml version="1.0" encoding="UTF-8"?><brain><pos><add old="dpois" new="depois"/><add old="ksa" new="casa"/></pos></brain>');
  equal(result , "teste depois, antes!", "Replaces post-processing keys sucessfully");
  
  result = siri.PostProcess("ksa dos mallandros", '<?xml version="1.0" encoding="UTF-8"?><brain><pos><add old="dpois" new="depois"/><add old="ksa" new="casa"/></pos></brain>');
  equal(result , "casa dos mallandros", "Replaces post-processing keys sucessfully");
  });
  
test("Should replace synonyms", function(){
  var result = siri.ReplaceSynonyms("ae, casa dos manos!", '<?xml version="1.0" encoding="UTF-8"?><brain><syns><add syn="@casa" matches="casa barraco ape moradia"/></syns></brain>');
  equal(result , "ae, @casa dos manos!", "Replaces synonyms sucessfully");
  
  var result = siri.ReplaceSynonyms("ae, barraco dos manos!", '<?xml version="1.0" encoding="UTF-8"?><brain><syns><add syn="@casa" matches="casa barraco ape moradia"/></syns></brain>');
  equal(result , "ae, @casa dos manos!", "Replaces synonyms sucessfully");
  
  var result = siri.ReplaceSynonyms("ae, estou em casa", '<?xml version="1.0" encoding="UTF-8"?><brain><syns><add syn="@casa" matches="casa barraco ape moradia"/></syns></brain>');
  equal(result , "ae, estou em @casa", "Replaces synonyms sucessfully");
  
  var result = siri.ReplaceSynonyms("ape casa ape ape moradia ape ape barraco barraco", '<?xml version="1.0" encoding="UTF-8"?><brain><syns><add syn="@casa" matches="casa barraco ape moradia"/></syns></brain>');
  equal(result , "@casa @casa @casa @casa @casa @casa @casa @casa @casa", "Replaces synonyms sucessfully");
  
});

test("Should replace get n-esim * content", function(){
	var s = "This is a common mistake";
	var d1 = "this *",
		d2 = "* common mistake"
		d3 = "this * common *";
	var r1 = "is a common mistake"
		r2 = "This is a"
		r3 = "is a"
		r4 = "mistake";
	equal(r1, adjustReassemb(s,d1,1), "First pair working");
	equal(r2, adjustReassemb(s,d2,1), "Second pair working");
	equal(r3, adjustReassemb(s,d3,1), "Third pair working");
	equal(r4, adjustReassemb(s,d3,2), "Third pair working");
});

test("Should get the right number in the parentesis", function(){
	var t1 = getParentesisNumbers("This is a common (9) test in the middle")
		t2 = getParentesisNumbers("This is a common (9) test in the (8) middle");
	equal(9, t1[0], "Test in the middle working");
	equal(8, t2[1], "Test in the middle working");
})

//************************************MODULE GUI
module("GUI", {
  setup: function() {
    //siri = new Alisiri();
	siriGui = new AlisiriGui();
	$("#container").empty();
  }, teardown: function() {
    //siri = null;
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
	equal(divContainer.html(), '<div class="user-text">text of the message</div>', "Container com mensagem do usuário depois do método");	
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

test( "Should print a default message if no key was selected", function(){
  var listKey = new Array();
  divContainer = $("#container");
  equal(divContainer.html(), "", "Container vazio antes do submit");
  listKey = siri.GetPossibleKeysWithDecomp("gosantos", '<?xml version="1.0" encoding="UTF-8"?><brain><initial>Ola, como vai voce?</initial><final>Tchau, ate mais</final><keys><add key="Chaves" decomp="*" order="5"><reassemb text="r1"/><reassemb text="r2"/></add><add key="Chaves" decomp="* isto e *" order="9"><reassemb text="r3"/><reassemb text="r4"/></add><add key="madruga" decomp="*" order="1"><reassemb text="r5"/><reassemb text="r6"/></add></keys></brain>');
  equal(null, listKey, "No key should return");
  equal(divContainer.html(), '<div class="alisiri-text">' + siriGui.DefaultMessage + '</div>', "Container com mensagem da alisiri depois do submit");	
});
