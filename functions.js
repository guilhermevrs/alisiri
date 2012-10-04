//*******************Constantes*******************
var database_url = "database.xml";
var is_chrome = $.browser.webkit && !!window.chrome;
var is_safari = $.browser.webkit && !window.chrome;
//*****************Fim de constantes**************


$(document).ready(function(){
	$('#txt-sender').focus();
	siriGui.Hello();
});

//*****************Funções globais****************
function RecursiveRegEx(array, init)
{
//\s\b((\w)*\s[AQUI])|(\s[AQUI])\b
	var str = "\\s\\b((\\w)*\\s";
	var replace = "";
	var recursive = false;
	for(var i=init; i<array.length; i++){
		if(array[i] != '*'){
			if(i!=init)
				replace += ' ';
			replace += array[i];
		}
		else
		{
			if(i<array.length-1)
			{
				recursive = true;
				str += replace + ')|(\\s' + replace + ')\\b';
				str += RecursiveRegEx(array, i+1);
			}
		}
	}
	if(!recursive)
	{
		str += replace + ')|(\\s' + replace + ')\\b';
		if(array[array.length-1] != '*')
			str += '$';
	}
	return str;
}

function removeAccents(text) {
text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
text = text.replace(new RegExp('[Ç]','gi'), 'c');
return text;
}
// \ . , - \/ # ! $ % \^ & \* ; : { } = \- _ ` ~ ( ) //Should I add em all?
function addSpacesToPunctuation(text)
{
	text = text.replace(new RegExp('[,]','gi'), ' ,');
	text = text.replace(new RegExp('[.]','gi'), ' .');
	text = text.replace(new RegExp('[!]','gi'), ' !');
	text = text.replace(new RegExp('[?]','gi'), ' ?');
	text = text.replace(new RegExp('[;]','gi'), ' ;');
	text = text.replace(new RegExp('[:]','gi'), ' :');
	return text;
}
function removeSpacesFromPunctuation(text)
{
	text = text.replace(new RegExp(' ,','gi'), ',');
	text = text.replace(new RegExp(' \\.','gi'), '.');
	text = text.replace(new RegExp(' !','gi'), '!');
	text = text.replace(new RegExp(' \\?','gi'), '?');
	text = text.replace(new RegExp(' ;','gi'), ';');
	text = text.replace(new RegExp(' :','gi'), ':');
	return text;
}

//***************Fim de funções globais***********

//********************Classes*********************
function Alisiri()
{
	this.connectToDatabase = function(callback) {
		$.ajax({
		  type: "GET",
		  url: database_url,
		  success: function(result){
			if(typeof callback === 'function') callback.call(this, result);
		  },
		  dataType: 'xml',
		  error: function () {
			alert("Ocorreu um erro inesperado durante o processamento.");
		  }
		});
	},
	
	this.getInitialPhrase = function(data)  {
		return $(data).find("initial").text();	
	},

	this.getFinalPhrase = function(data)  {
		return $(data).find("final").text();
	},

	this.CheckIfIsQuitPhrase = function(phrase, data) {
		var t = $(data).find("quit").find('add[text="'+ phrase + '"]');
		return t.length > 0;
	},
	
	this.GetPossibleKeys = function(phrase, data){
		var keys = new Array();
		var minPhrase = phrase.toLowerCase();
		$(data).find("keys").find("add").each(function(index, el){
			var xmlEl = $(el);
			var key = xmlEl.attr("key").toLowerCase();
			var regOb = new RegExp('\\b'+key+'\\b');
			if(regOb.test(minPhrase))
			{
				var newKeyEl = new KeyElement();
				newKeyEl.order = parseInt(xmlEl.attr("order"));
				newKeyEl.key = key;
				newKeyEl.decomp = xmlEl.attr("decomp");
				newKeyEl.reassemb = new Array();
				xmlEl.find("reassemb").each(function(i,e){
					var newReassembEl = new ReassembElement();
					newReassembEl.text = $(e).attr("text");
					newKeyEl.reassemb.push(newReassembEl);
				});
				keys.push(newKeyEl);
			}
		});
		return keys.sort(function(a,b){
			if(a.order > b.order)
				return -1;
			else if(a.order < b.order)
				return 1;
			else
				return 0;
		});
	},
	
	this.ConvertToRegExp = function(decomp){
		var splitDecomp = decomp.split(" ");
		var str = "";
		var ini = "";
		var fim = "";
		var dec = "";
		var i;
		if(splitDecomp.length > 1)
		{
			if(splitDecomp[0]!="*")
			{
				str="^";
				for(i=0; i<splitDecomp.length-1; i++)
				{
					dec = splitDecomp[i];
					if(dec != '*')
					{
						if(i>0)
							str += ' ';
						str += dec;
					}
					else
					{
						str += '\\s';
						if(i<splitDecomp.length-1)
						{
							str += RecursiveRegEx(splitDecomp,i+1);
						}
					}
				}
			}
			else
			{
				for(i=1; i<splitDecomp.length; i++)
				{
					dec = splitDecomp[i];
					if(dec != '*')
					{
						if(i>1)
							str += ' '
						str += dec;
						if(i==splitDecomp.length-1)
							str = str + "$";
					}
					else
					{
						if(i==splitDecomp.length-1)
						{
							str = "\\b" + str + '\\b';
						}
						else
						{
							str = "\\b" + str + "\\b" + RecursiveRegEx(splitDecomp,i+1);
							break;
						}
					}
						
				}
			}
		}
		return new RegExp(str, "gi");
	},
	
	this.VerifyDecomp = function(phrase, decomp){
		var regEx = this.ConvertToRegExp(decomp);
		return regEx.test(phrase);
	},
	
	this.GetPossibleKeysWithDecomp = function(phrase, data){
		var possibleKeys = this.GetPossibleKeys(phrase, data);
		for (i=0; i<possibleKeys.length; i++)
		{
			if(this.VerifyDecomp(phrase, possibleKeys[i].decomp))
				return possibleKeys[i];
		}
		var gui = new AlisiriGui();
		gui.AddAlisiriText(gui.DefaultMessage);
		gui = null;
		return null;
	},

	this.GetRandomReassemb = function(key){
		var index = Math.floor((Math.random()*key.reassemb.length)+0);
		return key.reassemb[index];
	}
	
	this.ProcessorReplace = function(userInput, data, mode){
		if(mode != "pre" && mode !="pos")
			return null;
			
		userInput = addSpacesToPunctuation(userInput);
		$(data).find(mode).find("add").each(function(index, el){
			var xmlEl = $(el);
			var oldValue = xmlEl.attr("old").toLowerCase();
			var newValue = xmlEl.attr("new").toLowerCase();
			
			userInput = userInput.replace(new RegExp('\\s' + oldValue + '\\s','gi'), ' ' + newValue + ' ');
			userInput = userInput.replace(new RegExp('^' + oldValue + '\\s','gi'), newValue + ' ');
			userInput = userInput.replace(new RegExp('\\s' + oldValue + '$','gi'), ' ' + newValue);
		});
		userInput = removeSpacesFromPunctuation(userInput);
		return userInput;
		}
		
	this.ReplaceSynonyms = function(userInput, data){
	
		userInput = userInput.replace(new RegExp('\\s','gi'), '  ');
		
		$(data).find("syns").find("add").each(function(index, el){
			var xmlEl = $(el);
			var syn = xmlEl.attr("syn").toLowerCase();
			var matches = xmlEl.attr("matches").toLowerCase();
			var matchlist = matches.split(" ");
			
			for(var i = 0; i < matchlist.length; i++)
			{
				userInput = userInput.replace(new RegExp('\\s' + matchlist[i] + '\\s','gi'), ' ' + syn + ' ');
				userInput = userInput.replace(new RegExp('^' + matchlist[i] + '\\s','gi'), syn + ' ');
				userInput = userInput.replace(new RegExp('\\s' + matchlist[i] + '$','gi'), ' ' + syn);
			}
		});
		
		userInput = userInput.replace(new RegExp('\\s\\s','gi'), ' ');
		return userInput;
	}
		
	this.PreProcess = function(userInput, data){
		userInput = removeAccents(userInput);
		userInput = userInput.toLowerCase();
		
		userInput = addSpacesToPunctuation(userInput);
		
		userInput = this.ProcessorReplace(userInput, data, "pre");
		userInput = this.ReplaceSynonyms(userInput, data);
		
		userInput = removeSpacesFromPunctuation(userInput);
		return userInput;
	}
	
	this.PostProcess = function(inputText, data){
		inputText = addSpacesToPunctuation(inputText);
		
		inputText = this.ProcessorReplace(inputText, data, "pos");
		
		inputText = removeSpacesFromPunctuation(inputText);
		return inputText;
	}
	
};

function KeyElement()
{
	this.order;
	this.key;
	this.decomp;
	this.reassemb = new Array();
};

function ReassembElement()
{
	this.text="";
}

function AlisiriGui()
{
	var self = this;
	
	this.FirstTime = true;
	this.DefaultMessage = "Desculpe, não entendi a última coisa que você disse";

	this.AddText = function(text, cssClass){
		$("#container").append('<div class="'+ cssClass +'">'+ text +'</div>');
		this.ScrollContainer();
	}
	
	this.AddAlisiriText = function(text){
		this.AddText(text,"alisiri-text");
		this.Speak(text);
	}
	
	this.ScrollContainer = function(){
		container.scrollTop = container.scrollHeight;
	}
	
	this.AddUserText = function(text){
		this.AddText(text,"user-text");
		$("#txt-sender").val("");
	}
	
	this.GetUserMessage = function(){
		return $("#txt-sender").val();
	}

	this.ProcessUserInput = function(){
		if ($.trim($("#txt-sender").val()) != ""){
			var userInput = this.GetUserMessage();
			var self = this;
			this.AddUserText(userInput);
			
			siri.connectToDatabase(function(data){
				userInput = siri.PreProcess(userInput, data);
				if(self.FirstTime) {
					self.AddAlisiriText(siri.getInitialPhrase(data));
					self.FirstTime = false;
				}
				if(siri.CheckIfIsQuitPhrase(userInput, data))
				{
					self.AddAlisiriText(siri.getFinalPhrase(data));
				}
				else 
				{
					var listKey = siri.GetPossibleKeysWithDecomp(userInput, data);
					if(listKey != null)
					{
						var reassemb = siri.GetRandomReassemb(listKey);
						self.AddAlisiriText(reassemb.text);
					}
				}
			});
		}
	}
	
	this.Hello = function(){
	var self = this;
	siri.connectToDatabase(function(data){
		self.AddAlisiriText(siri.getInitialPhrase(data));
		self.FirstTime = false;
		});
	}
	
	this.Speak = function(text){
		if ( !($.browser.msie || is_safari)) {
			text = removeAccents(text);
			console.log(text);
			meSpeak.speak(text, { amplitude: 100, wordgap: 3, pitch: 50, speed: 175 });
		}
		else
		{
			speech.play(encodeURIComponent(text), 'pt');
		}
	}

	$('#txt-sender').keypress(function(event) {
		if (event.which == 13)
			self.ProcessUserInput();
			
	});
	$("#btn-sender").off( "click" ).on( "click", function( event ) {
		self.ProcessUserInput();
	});
}
//*****************Fim de classes***********************