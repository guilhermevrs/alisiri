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
	}

	this.getFinalPhrase = function(data)  {
		return $(data).find("final").html();
	}
}
