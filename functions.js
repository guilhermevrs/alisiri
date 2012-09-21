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
		  success: function(xml){
			callback(xml);
		  },
		  dataType: 'xml',
		  error: function () {
			alert("Ocorreu um erro inesperado durante o processamento.");
		  }
		});
	}
}