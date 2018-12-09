


$(document).ready(function() {
	$("#btn_delete").click(function() {
		deleteFunction()

	})
		
	readFuntion();
	$("#btn_save").click(function () {
		let name = $("#txt_name").val()
		let lastName = $("#txt_last_name").val()
		let phone = $("#txt_phone").val()

		var persona = new Persona(name, lastName, phone)
		saveFunction(persona)
	})

	$("#txt_name").focus()

	appendToList()
	
})


function saveFunction (persona) {

	//localStorage.setItem("name", persona.name )
	//localStorage.setItem("lastName", persona.lastName )
	//localStorage.setItem("phone", persona.phone )

	var oldItems = JSON.parse(localStorage.getItem('personas')) || [];

	var newItem = {
	    'name': persona.name,
	    'lastName': persona.lastName,
	    'phone': persona.phone
	};

	oldItems.push(newItem);

	localStorage.setItem('personas', JSON.stringify(oldItems));


	console.log(localStorage)
	var ul = $("#peopleList");
	ul.append(
	`
		<li onclick="_showDetail(this)">
			<span class=""> ${persona.name}</span>	
			<span class="not-showing"> ${persona.lastName}</span>	
			<span class="not-showing">${persona.phone}</span>	
		</li>
	`
	)

}

function readFuntion() {
 var persona = new Persona(
 			localStorage.getItem("name"),
			localStorage.getItem("lastName"),
			localStorage.getItem("phone")
		)

 return persona;

}

function deleteFunction () {
	localStorage.clear()
	var ul = $("#peopleList *");
	ul.remove()
}
	
function _showDetail(element) {
	$(element.children).removeClass("not-showing")
}

function appendToList(){

		var local = readFuntion()
		var ul = $("#peopleList");
		

		if(localStorage.personas){
			var elements = JSON.parse(localStorage.personas)
			for (var i = 0; i < elements.length; i++) {
				ul.append(
				`
					<li onclick="_showDetail(this)">
						<span class=""> ${elements[i].name}</span>	
						<span class="not-showing"> ${elements[i].lastName}</span>	
						<span class="not-showing">${elements[i].phone}</span>	
					</li>
				`
				)	
			}
		}
		
		
}