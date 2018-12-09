
// Clase ----- // Contructor
var Producto = function	(pName, pDesc, pPrice) {

	this.name = pName
	this.desc = pDesc
	this.price = pPrice


}

//Producto.prototype.eleminar = function() {
//	return "Eliminado: "+ this.name
//}
//Producto.prototype.obtenerDescuento = function() {
	//return this.price * .4
//}

Producto.prototype = {
	agregar: function(name){
		//productList
		let list = $("#productList");
		list.append(`
			<li> ${this.name} 
				<button class="btnDelete" > Eliminar </button>
			</li>

			`)
		let txtInput = $("#txt_nombre")
		txtInput.focus()

//onclick="parentElement.remove()"
	},
	eliminar: function(element){
		element.remove()
	}
}