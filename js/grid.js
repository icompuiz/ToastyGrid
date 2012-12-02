var c = Math.ceil;

function CreateGrid(gridColumns, cellSize) {

	
	var gClass = "grid_" + gridColumns;
			
	var grid = $(document.createElement('div'));
	grid.addClass("grid");
	grid.addClass("grid_" + gClass);
	
	var clear = $(document.createElement('div'));
	clear.addClass('clear');
	for ( var row = 0; row < 100; row++ ) {
	
		for ( var col = 0; col < 11; col++ ) {
			
		
			var cell =  $(document.createElement('div'));
			cell.addClass("cell");
			cell.addClass("grid_1");
			cell.height(60);
			cell.attr("row", row);
			cell.attr("col", col);
			
			
			
			cell.droppable({
				accept: ".div",
				drop: function( event, ui ) {
					var dropped = ui.draggable;
					var droppedOn = $(this);
					
					var dRow = droppedOn.attr('row');
					var dCol = droppedOn.attr('col');
					
					var height = dropped.height();
					var width = dropped.width();
					height = height / cellSize;
					width = width / cellSize;

					console.log("dimensions: " + height + " x " + width);
					
					var mCol = width  % 2 == 0 ? c( width  / 2 ) + 1 : c( width  / 2 );
					var mRow = height % 2 == 0 ? c( height / 2 ) + 1 : c( height / 2 );
					
					var fCol = dCol - (mCol-1);
					var fRow = dRow - (mRow-1);
					
					console.log("dropped: " + dRow + " x " + dCol);
					console.log("middle: "    + mRow + " x " + mCol);
					console.log("final: "   + fRow + " x " + fCol);
					
					var destination =$('.cell[row="' + fRow + '"][col="'+ fCol +'"]');
					console.log(destination);
										
					$(dropped).detach().css( { top: 0, left: 0} ).appendTo(destination);					
					
					// find the cell at the upper left corner
				}
			});
			grid.append(cell);
		}
		grid.append(clear.clone());
	}
	
	
	
	return grid;

}

var cellSize = 60;

var grid = CreateGrid(12, cellSize);

var container = $("#gridHost");

grid.appendTo(container);

// var item = $(document.createElement('div'));
// item.addClass('resizable');
// item.addClass('div');
// var handle = $(document.createElement('p'));
// handle.addClass('handle');
// handle.html("HANDLE");

// item.append(handle);

var divBox = '<div class="resizable div"><div class="handle"><div class="edit_element_button"></div><div class="drop_element_button"></div></div><div class="content_area">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div></div>';
var modalDia = '<div id="dialog-modal" title="Basic modal dialog"><p>Adding the modal overlay screen makes the dialog look more prominent because it dims out the page content.</p></div>';
divBox = $(divBox);
modalDia = $("#dialog-modal").dialog({
	height: 140,
	modal: true,
	autoOpen: false,
	width: 800,
	height: 550	
});;



container.resizable({ maxWidth: 960 });



$("#cancel_editor_button").click(function() {
	
	modalDia.dialog('close');
});
$("#submit_editor_button").click(function() {
		
	var textBox = modalDia.find( 'textarea.editor' );
	var innerHtml  = textBox.val();
	var elementName = textBox.attr('element');
	
	var elementDiv = $('.div[name="' + elementName +'"]')
	var contentArea = elementDiv.children('.content_area');
	contentArea.html(innerHtml);
	
	modalDia.dialog('close');
	
});

$("#submit_layout_button").click( function() {

	// copy grid 
	// delete handler elements
	// find elements with jquery ui classes like ui-draggable and remove those classes
	
	var gridCopy = grid.clone();
	gridCopy.find(".handle").remove();
	
	var html = gridCopy.html();
	
	$("#main").html(html);


});
var counter = 0;
$("#create_element_button").click( function() {
	counter++;
	var col = 5;
	var row = 5;
	var currentDiv = divBox.clone();

	currentDiv.attr('name', 'element_' + counter);

	currentDiv.appendTo(grid.children('.cell[row="' + row + '"][col="'+ col+'"]'));

	currentDiv.resizable({ grid: cellSize });
	currentDiv.draggable({
		grid: [60, 60],
		containment: '.grid',
		handle: '.handle',
		
		
	});
	currentDiv.css("z-index", 20);
	
	currentDiv.find(".drop_element_button").click( function() {

		$(this).closest('.div').remove();

	});

	currentDiv.find(".edit_element_button").click( function() {

		var element = $(this).closest('.div');
		var contentArea = element.children('.content_area');
		var innerContent = contentArea.html();
		var elementName = element.attr('name');
		modalDia.find( 'textarea.editor' ).val(innerContent).attr('element', elementName);
		modalDia.dialog('open');

	});


});

