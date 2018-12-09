
$(document).ready(function() {
	//init btnSave
	//let elBtnSave = document.getElementById("btn_save")
	//elBtnSave.addEventListener("click", _saveFunction)

	$("#btn_save").click(_saveFuntion)

	$("ul").on("click", ".btnDelete", function(){
		var element = new Producto()
		element.eliminar(this.parentElement)
	})

})

var _saveFuntion = function saveFunction () {
	//callback from save_btn
	let name = $("#txt_nombre").val()
	let desc = $("#txt_desc").val()
	let price = $("#txt_precio").val()

	//var object = {};
	//var array = [];

	var productoLiteral = {};
	productoLiteral.name = name
	productoLiteral.desc = desc
	productoLiteral.price = price

	productoLiteral.save = function() {
		return "se guardo: " + this.name
	}

	// JSON (Javascript Object Notation)
	var produtoJson = {
		name: name,
		desc: desc,
		price: price,
		save: function() {
			return "se guardo: " + this.name
		}
	}

	var element = new Producto(name, desc, price)
	//alert("fue guardado " 
	//	+ element.name + " " 
	//	+ element.desc + " " 
	//	+ element.price)

	element.agregar(name)


}
