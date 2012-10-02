$(document).ready(function(){
	$('#txt-sender').focus();
});

//Constantes
var database_url = "database.xml";

//Classes
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
		return t.html() != undefined;
	},
	
	this.GetPossibleKeys = function(phrase, data){
		var keys = new Array();
		var minPhrase = phrase.toLowerCase();
		$(data).find("keys").find("add").each(function(index, el){
			var xmlEl = $(el);
			var key = xmlEl.attr("key").toLowerCase();
			if(minPhrase.indexOf(key) != -1)
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
		var i;
		if(splitDecomp.length > 1)
		{
			if(splitDecomp[0]=="*")
			{
				if(splitDecomp[splitDecomp.length-1] == "*")
				{
					str+="\\b";
					for(i=1;i<splitDecomp.length-1;i++){
						str+=splitDecomp[i];
						if(i<splitDecomp.length-2)
							str+=" ";
					}
					str+="\\b";
				}
				else
				{
					for(i=1;i<splitDecomp.length;i++){
						str+=splitDecomp[i];
						if(i<splitDecomp.length-1)
							str+=" ";
					}
					str+="$";
				}
			}
			else if(splitDecomp[splitDecomp.length-1] == "*")
			{
				str+="^";
				for(i=0;i<splitDecomp.length-1;i++){
					str+=splitDecomp[i];
					if(i<splitDecomp.length-2)
						str+=" ";
				}
			}
		}
		str = str.replace("é", "\x233");
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
	}
};

function KeyElement()
{
	var order;
	var key;
	var decomp;
	var reassemb = new Array();
};

function ReassembElement()
{
	var text;
}

function AlisiriGui()
{
	this.FirstTime = true;

	this.DefaultMessage = "Desculpe, não entendi";

	this.AddText = function(text, cssClass){
		$("#container").append('<div class="'+ cssClass +'">'+ text +'</div>');
		this.ScrollContainer();
	}
	
	this.AddAlisiriText = function(text){
		this.AddText(text,"alisiri-text");
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
				//data = $.parseXML(data);
				if(self.FirstTime) {
					self.AddAlisiriText(siri.getInitialPhrase(data));
					self.FirstTime = false;
				}
			});
		}
	}
	
	var self = this;
	$('#txt-sender').keypress(function(event) {
		if (event.which == 13)
			self.ProcessUserInput();
			
	});
	$("#btn-sender").off( "click" ).on( "click", function( event ) {
		self.ProcessUserInput();
	});
}
