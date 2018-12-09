var Object3D = function(gl, shaderProgram) {
	this.gl = gl;
	this.shaderProgram = shaderProgram;
	this.vertexBuffer = null;
	this.indexBuffer = null;
	this.colorBuffer = null;
	this.textureCoordBuffer = null;
	this.position = { x: 0, y:0, z: -5};
	this.rotation = { x: 0, y:0, z: 0};
	this.scale = { x: 1, y:1, z: 1};
	this.color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 }
	this.drawMode = this.gl.TRIANGLE_STRIP;
	this.drawByIndex = false;
	this.texture = null;
	this.useTexture = false;
}

Object3D.prototype = {
	initVertexBuffer: function(vertices) {
		this.vertexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		this.vertexBuffer.itemSize = 3;
		this.vertexBuffer.numItems = vertices.length / this.vertexBuffer.itemSize;
		this.vertexBuffer.bufferType = this.gl.ARRAY_BUFFER;
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	},
	initIndexBuffer: function(indices) {
		this.indexBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = indices.length;
		this.indexBuffer.bufferType = this.gl.ELEMENT_ARRAY_BUFFER;
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	},
	initColorBuffer: function(colors) {
		if (this.colorBuffer == null) {
			this.colorBuffer = this.gl.createBuffer();
			this.colorBuffer.itemSize = 4;
			this.colorBuffer.numItems = colors.length / this.colorBuffer.itemSize;
			this.colorBuffer.bufferType = this.gl.ARRAY_BUFFER;
		}
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
	},
	initTextureCoordBuffer: function(textureCoords) {
		// .. Crear el buffer de coordenadas de textura
	},
	setColor: function(color) {
		this.color = color;
		var colors = [];
		for (var i = 0; i < this.vertexBuffer.numItems; i++) {
			colors.push(color.r);
			colors.push(color.g);
			colors.push(color.b);
			colors.push(color.a);
		}
		this.initColorBuffer(colors);
	},
	setTexture: function(texturePath, textureCoords) {
		// Creamos el buffer de coordenadas de textura
		this.initTextureCoordBuffer(textureCoords);
		var gl = this.gl;
		// Crea el objeto textura de WebGL
		// ..

		// ..
		// ..

		this.texture.bitmap = new Image();
		this.texture.bitmap.src = texturePath;
		this.texture.bitmap.onload = () => {
			// Al igual que los buffers que los seleccionamos como hemos visto con "bindBuffer"
			// seleccionaremos nuestro objeto textura con "bindTexture", cualquier configuracion que hagamos
			// posteriormente, se le aplicaran a la textura que este seleccionada con "bindTexture"
			// .. 

			// Con este metodo "pixelStorei" le mandaremos una configuracion de la imagen que estamos cargando
			// en este caso le indicamos que la imagen que cargaremos debe ser volteada en Y, esto por que
			// el sistema de coordenadas de webgl no es igual al de la imagen, por ejemplo el de 
			// webgl tenemos que si x aumenta es derecha, si x disminuye es izquierda, si Y aumenta es arriba
			// y si Y disminuye es abajo, pero en las imagenes es distinto en Y, ya que si Y aumenta es abajo
			// y si Y disminuye es arriba es por eso que la tenemos que "flipear" en Y.
			// .. 

			// Asigna una textura al objeto texture seleccionado por bindTexture
			// Parametros:
			// 1.- Target: gl.Texture_2D especifica una textura 2D
			// 2.- Level: Especifica el detalle de la textura donde 0 es el mismo detalle que el de la textura
			// 3.- internalFormat: Especifica los componentes del color en la textura. RGB
			// 4.- format: Especifica el formato por texel en este caso RGB
			// 5.- type: Especifica el tipo de dato de la informacion de cada texel. gl.UNSIGNED_BYTE
			// 6.- pixels: La imagen o los pixeles			
			// Ejemplo:
			 	//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that.texture.image);
			// .. 

			// Con el metodo "texParameteri" le indicaremos a WebGL la configuracion que debe llevar nuestra textura
			// al ser mostrada. 
			//		"TEXTURE_MAG_FILTER" le indica a WebGL como debe ampliar la textura cada que estemos mas cercas del objeto
			// 		"TEXTURE_MIN_FILTER" le indica a WebGL como debe reducir la textura cada que estemos mas lejos del objeto
			//		"NEAREST" es un tipo de escalado, es el menos robusto ya que solo aplica algoritmos basicos para el ampliado
			//				  y reduccion de la textura. 
			//			Estos son los tipos de escalados que hay y que puedes probar si quieres verlos:
			//				"NEAREST" "LINEAR" "GL_NEAREST_MIPMAP_NEAREST" "GL_LINEAR_MIPMAP_NEAREST" "GL_NEAREST_MIPMAP_LINEAR"
			//				"GL_LINEAR_MIPMAP_LINEAR"
			// ..
			// .. 
			this.useTexture = true;
		};
	},
	fixRotation: function() {
		this.rotation.x = (this.rotation.x > 360) ? this.rotation.x - 360 : this.rotation.x;
		this.rotation.y = (this.rotation.y > 360) ? this.rotation.y - 360 : this.rotation.y;
		this.rotation.z = (this.rotation.z > 360) ? this.rotation.z - 360 : this.rotation.z;

		this.rotation.x = (this.rotation.x < 0) ? this.rotation.x + 360 : this.rotation.x;
		this.rotation.y = (this.rotation.y < 0) ? this.rotation.y + 360 : this.rotation.y;
		this.rotation.z = (this.rotation.z < 0) ? this.rotation.z + 360 : this.rotation.z;
	},
	draw: function() {
		var gl = this.gl;
		this.fixRotation();
		
		var mvMatrix = mat4.create();
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(this.position.x, this.position.y, this.position.z));
		mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.x);
		mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.y);
		mat4.rotateZ(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.z);
		mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(this.scale.x, this.scale.y, this.scale.z));
		// INFORMAMOS AL SHADER SOBRE LA MATRIZ DE TRANSFORMACIONES
		gl.uniformMatrix4fv(this.shaderProgram.uMVMatrix, false, mvMatrix )
		
		// SELECCIONAMOS EL BUFFER DE COLOR Y COMUNICAMOS AL SHADER	
		gl.bindBuffer(this.colorBuffer.bufferType, this.colorBuffer);
		gl.vertexAttribPointer(this.shaderProgram.aVertexColor, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// SELECCIONAMOS EL BUFFER DE VERTICES Y COMUNICAMOS AL SHADER
		gl.bindBuffer(this.vertexBuffer.bufferType, this.vertexBuffer);
		gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		// SELECCIONAMOS EL BUFFER DE COORDENADAS DE TEXTURA Y COMUNICAMOS AL SHADER
		if (this.useTexture) {			
			// ACTIVAMOS LA TEXTURA 0
			gl.activeTexture(gl.TEXTURE0); // TENEMOS DE 0 - 31
			// SELECCIONAMOS LA TEXTURA
			//.. 
			// INFORMAMOS AL SHADER SOBRE LA TEXTURA QUE UTILIZARA EL USAMPLER. EN ESTE CASO LA TEXTURA 0
			// .. 
			// SELECCIONAMOS EL BUFFER DE COORDENADAS DE TEXTURA Y COMUNICAMOS AL SHADER
			// .. 
			// ..
			// HABILITAMOS EL ENVIO DE TIPO ARRAY DE LAS COORDENADAS DE TEXTURA
			gl.enableVertexAttribArray(this.shaderProgram.aTextureCoord);
		}
		
		// HABILITAMOS EL ENVIO DE TIPO ARRAY DE LOS VERTICES Y COLORES
		gl.enableVertexAttribArray(this.shaderProgram.aVertexColor);
		gl.enableVertexAttribArray(this.shaderProgram.aVertexPosition);

		if (this.drawByIndex == false) {
			gl.bindBuffer(this.vertexBuffer.bufferType, this.vertexBuffer);			
			// DIBUJAMOS POR VERTICES		
			gl.drawArrays(this.drawMode, 0, this.vertexBuffer.numItems);
		} else {
			gl.bindBuffer(this.indexBuffer.bufferType, this.indexBuffer);
			// DIBUJAMOS POR INDICES
			gl.drawElements(this.drawMode, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}

		// DESHABILITAMOS EL ENVIO DE TIPO ARRAY DE LOS VERTICES Y COLORES
		gl.disableVertexAttribArray(this.shaderProgram.aVertexColor);
		gl.disableVertexAttribArray(this.shaderProgram.aVertexPosition);
		if (this.useTexture) {
			// DESHABILITAMOS EL ENVIO DE TIPO ARRAY DE LAS COORDENADAS DE TEXTURA
			gl.disableVertexAttribArray(this.shaderProgram.aTextureCoord);
		}

	}
}

Object3D.createFromVertices = function(gl, shaderProgram, vertices) {
	var object3D = new Object3D(gl, shaderProgram);
	object3D.initVertexBuffer(vertices);
	return object3D;
}

Object3D.createCubeWithColor = function(gl, shaderProgram) {
	var vertices = [
		// Front
		 -1.0, -1.0,  1.0, //0
		  1.0, -1.0,  1.0, //1
		  1.0,  1.0,  1.0, //2
		 -1.0,  1.0,  1.0, //3
		 
		 // Back
		 -1.0, -1.0, -1.0, //4
		 -1.0,  1.0, -1.0, //5
		  1.0,  1.0, -1.0, //6
		  1.0, -1.0, -1.0, //7
		 
		 // Top
		 -1.0,  1.0, -1.0, //8
		 -1.0,  1.0,  1.0, //9
		  1.0,  1.0,  1.0, //10
		  1.0,  1.0, -1.0, //11
		 
		 // Bottom 
		 -1.0, -1.0, -1.0, //12
		  1.0, -1.0, -1.0, //13
		  1.0, -1.0,  1.0, //14
		 -1.0, -1.0,  1.0, //15
		 
		 // Right
		  1.0, -1.0, -1.0, //16
		  1.0,  1.0, -1.0, //17
		  1.0,  1.0,  1.0, //18
		  1.0, -1.0,  1.0, //19
		 
		 // Left
		 -1.0, -1.0, -1.0, //20
		 -1.0, -1.0,  1.0, //21
		 -1.0,  1.0,  1.0, //22
		 -1.0,  1.0, -1.0  //23
	];

	var indices = [ 
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottomm
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23    // left
	];

	var colors = [
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,
		1.0, 1.0, 1.0, 1.0,

		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,
		1.0, 1.0, 0.0, 1.0,

		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 0.0, 1.0, 1.0,

		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		1.0, 0.0, 0.0, 1.0,

		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,

		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 1.0, 1.0,
		0.0, 1.0, 1.0, 1.0
	];

	var object3D = new Object3D(gl, shaderProgram);
	object3D.initVertexBuffer(vertices);
	object3D.initIndexBuffer(indices);
	//object3D.initColorBuffer(colors);
	object3D.setColor({ r:1.0, g:1.0, b:1.0, a:1.0 })
	object3D.drawByIndex = true;
	object3D.drawMode = gl.TRIANGLES;
	return object3D;
}

Object3D.createCubeWithTexture = function(gl , shaderProgram) {
	var object3D = Object3D.createCubeWithColor(gl, shaderProgram);
	var textureCoords = [
		// Front
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,

		// Back
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,

		// Top
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,

		// Bottom
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,

		// Right
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,

		// Left
		0.0, 0.0,
		0.0, 1.0,
		1.0, 1.0,
		1.0, 0.0,
	];
	object3D.setTexture("assets/texture_1.jpg", textureCoords);	
	return object3D;
}








