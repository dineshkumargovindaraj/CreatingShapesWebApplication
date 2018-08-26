

//##############################################
var SERVER_URL = 'http://dev.cs.smu.ca:8110';
//##############################################

var position = 0;
var check = true;
var check2 = false;


function drawshapes(shape, style , colour){
	var canvas = document.getElementById("canvasElement");//get the element
	var ctx = canvas.getContext("2d");//get the content
   	var w = $('#canvasElement').width();
	var h = $('#canvasElement').height();

	//clear
	ctx.clearRect(0, 0, w, h);
	if (style == "FILL")
	{
		ctx.fillStyle = colour;
		switch (shape) {
			case 'circle':
				ctx.beginPath();
				ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
				ctx.fill();
				break;
			case 'rectangle':
				ctx.fillRect(0, 0, w, h);
				break;
			case 'triangle':
				ctx.beginPath();
				ctx.moveTo(0, h);
				ctx.lineTo(w / 2, 0);
				ctx.lineTo(w, h);
				ctx.closePath();
				ctx.fill();
					
		  }  
}
				
	  else 
	{
		ctx.strokeStyle = colour;

		switch (shape) {
			case 'circle':
				ctx.beginPath();
				ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
				ctx.stroke();
				break;
			case 'rectangle':
				ctx.strokeRect(0, 0, w, h);
				break;
			case 'triangle':
				ctx.beginPath();
				ctx.moveTo(0, h);
				ctx.lineTo(w / 2, 0);
				ctx.lineTo(w, h);
				ctx.closePath();
				ctx.stroke();
			}
	}
				
}

function validateData() {
	
    //first get the values from the fields
	
    var shape = $("#shapeTypes").val();
    var colour = $("#colorField").val();
	
    //check empty fields
    if (shape == 'Please select a shape') {
        alert("Please select the shape!");
        $("#shapeTypes").focus();
        return false;
    }
    if (colour == '') {
        alert("Please enter the colour!");
        $("#colorField").focus();
        return false;
    }	 		
    return true;
}


function emptyFields() {
    $("#shapeTypes").val('');
    $("#colorField").val('');
}

$('#saveButton').click(
        function () {
		var position=0;
            if (validateData()) {
				var style ;
				var IsFill = $('#styleRadioFill')[0].checked;				
				if (IsFill) {
				style = "FILL";
				}
				else{
				style = "STROKE";
				}
                //create an object
					
                var newObj = {
					"Shape": $("#shapeTypes").val(),
                  			"Colour": $("#colorField").val(),
					"Style":style 
                };
                   $.post(SERVER_URL + "/saveShape",
                        newObj,
                        function (data) {
                            alert(data);

                            //now empty the fields
                            emptyFields();

                        }).fail(function (error) {
                    alert(error.responseText);
                });
            }
        });


$('#nextButton').click(
        function () {
		emptyFields();
                     
		var shapes = [];
            $.post(SERVER_URL + '/getAllShapes',
                    null,
		    function (data) {
	
			shapes = data;
			
			if (shapes == null || shapes.length == 0) {
	 			    alert("No record found");
	    
			}
			
			else if (position == 0){
				alert("No next record !!! Click Previous");
				position = 0;
				check2 = true;

			}	

			else {
			    
			    if (check){
				position = data.length - 1;
				check = false;
			    }
			    else{
				position = position - 1;
				
				}
                 	     
			    var i = position;
			    var shape = shapes[i].Shape;
			    var colour = shapes[i].Colour; 
			    var style = shapes[i].Style;
			    $("#shapeTypes").val(shape);
			    $("#colorField").val(colour);
				
			    drawshapes(shape,style,colour);

			    $("#index").text("Index : "+position);
      			    $("#shape").text("Shape : "+shape);
                            $("#colorName").text("Colour : "+colour);
          
                            $("#index").css("color",colour);
                            $("#shape").css("color",colour);
        		    $("#colorName").css("color",colour);
				
			alert('Records downloaded successfully!');
			
			}
						
		    }).fail(function (error) {
			alert(error.responseText);
		    });

			}
);


$('#previousButton').click(
        function () {
	            emptyFields();
          
			var shapes = [];
            $.post(SERVER_URL + '/getAllShapes',
                    null,
		    function (data) {
		
				shapes = data;
				
			if (shapes == null || shapes.length == 0) {
			        alert("No record found");
			    
			}
			
			else if (position > shapes.length-2){
				alert("No previous record !!! Click Next");
				position = shapes.length;

			}		

			else {

			    if (check){
				position = 0;
				check = false;
			    }
			    else if (check2) {
				position = 0;
				
			    }
			    
			    else{
				position = position+1;				
				}
			    
                 	    var i = position;
			    var shape = shapes[i].Shape;
			    var colour = shapes[i].Colour; 
			    var style = shapes[i].Style;

			    $("#shapeTypes").val(shape);
			    $("#colorField").val(colour);
				
			    drawshapes(shape,style,colour);
			    $("#index").text("Index : "+position);
      			    $("#shape").text("Shape : "+shape);
                            $("#colorName").text("Colour : "+colour);
          
                            $("#index").css("color",colour);
                            $("#shape").css("color",colour);
        		    $("#colorName").css("color",colour);			
				
			alert('Records downloaded successfully!');
			
			if (check2){
				check2 = false;
				}
			}
						
		    }).fail(function (error) {
			alert(error.responseText);
		    });

			}
);

