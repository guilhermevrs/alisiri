$(document).ready(function(){
	
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
		return $(data).find("initial").html();
	},

	this.getFinalPhrase = function(data)  {
		return $(data).find("final").html();
	},

	this.CheckIfIsQuitPhrase = function(phrase, data) {
		var t = $(data).find("quit").find('add[text="'+ phrase + '"]');
		return t.html() != undefined;
	}
};

function AlisiriGui()
{
	this.AddText = function(text, cssClass){
		$("#container").append('<div class="'+ cssClass +'">'+ text +'</div>')
	}
	
	this.AddAlisiriText = function(text){
		this.AddText(text,"alisiri-text");
	}
	
	this.AddUserText = function(text){
		this.AddText(text,"user-text");
	}
	
	this.GetUserMessage = function(){
		return $("#txt-sender").val();
	}
	
	var self = this;
	$("#btn-sender").off( "submit" ).on( "submit", function( event ) {
		self.AddUserText(self.GetUserMessage());
	});
}
