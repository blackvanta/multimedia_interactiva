var Object3D = function(gl, shaderProgram) {
	this.gl = gl;
	this.shaderProgram = shaderProgram;
	this.vertexBuffer = null; //espacio en memoria
	this.indexBuffer = null;
	this.position = { x: 0, y:0, z: -5};
	this.rotation = { x: 0, y:0, z: 0};
	this.scale = { x: 1, y:1, z: 1};
	this.drawMode = this.gl.TRIANGLE_STRIP;
	this.drawByIndex = false;
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
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer); //array de indices (element)
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
		this.indexBuffer.itemSize = 1;
		this.indexBuffer.numItems = indices.length;
		this.indexBuffer.bufferType = this.gl.ELEMENT_ARRAY_BUFFER;
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
	},
	draw: function() {
		var gl = this.gl;
		
		var mvMatrix = mat4.create();
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, mvMatrix, vec3.fromValues(this.position.x, this.position.y, this.position.z));
		mat4.rotateX(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.x);
		mat4.rotateY(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.y);
		mat4.rotateZ(mvMatrix, mvMatrix, (Math.PI / 180) * this.rotation.z);
		mat4.scale(mvMatrix, mvMatrix, vec3.fromValues(this.scale.x, this.scale.y, this.scale.z));
		// INFORMAMOS AL SHADER SOBRE LA MATRIZ DE TRANSFORMACIONES
		gl.uniformMatrix4fv(this.shaderProgram.uMVMatrix, false, mvMatrix )
		
		// SELECCIONAMOS EL BUFFER DE VERTICES Y COMUNICAMOS AL SHADER
		gl.bindBuffer(this.vertexBuffer.bufferType, this.vertexBuffer);
		gl.vertexAttribPointer(this.shaderProgram.aVertexPosition, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		// HABILITAMOS EL ENVIO DE TIPO ARRAY DE LOS VERTICES
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

		// DESHABILITAMOS EL ENVIO DE TIPO ARRAY DE LOS VERTICES
		gl.disableVertexAttribArray(this.shaderProgram.aVertexPosition);
	}
}

Object3D.createFromVertices = function(gl, shaderProgram, vertices) {
	var object3D = new Object3D(gl, shaderProgram);
	object3D.initVertexBuffer(vertices);
	return object3D;
}

Object3D.createCubeWithIndices = function(gl, shaderProgram) {
	var vertices = [
		-1.0, -1.0,  1.0,
	 	1.0, -1.0,  1.0,
	  	-1.0,  1.0,  1.0,
	   	1.0,  1.0,  1.0,
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0
	];

	var indices = [ 0, 1, 2, 3, 7, 1, 5, 4, 7, 6, 2, 4, 0, 1 ];

	var object3D = new Object3D(gl, shaderProgram);
	object3D.initVertexBuffer(vertices);
	object3D.initIndexBuffer(indices);
	object3D.drawByIndex = true;
	object3D.drawMode = gl.TRIANGLE_STRIP;
	return object3D;
}








