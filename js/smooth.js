	
	// smooth corner
	var modifier = new THREE.SubdivisionModifier(2);
	modifier.supportUVs = true;
	modifier.modify(geometry);
	
	
	geometry.computeBoundingBox();
	var max = geometry.boundingBox.max;
	var min = geometry.boundingBox.min;
	var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
	var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
	debugger;
	
	// zero the face vertex uvs
	geometry.faceVertexUvs[0] = [];
	
	// count how many faces we have per "side"
	var faces_per_side = geometry.faces.length / 6;
	var faces_left_in_side = faces_per_side;
	var curr_face = 0;
	
	// get all geometry faces and iterate them
	var faces = geometry.faces;
	for (var i = 0; i < faces.length ; i++) 
	{
		// keep track which side of the box we are editing
		if (faces_left_in_side-- <= 0)
		{
			faces_left_in_side = faces_per_side;
			curr_face++;
		}

		// get current face and its 3 vertices
		var face = faces[i];
		var v1 = geometry.vertices[face.a], v2 = geometry.vertices[face.b], v3 = geometry.vertices[face.c];
		
		// generate uv based on which face we are on
		switch (curr_face)
		{
			// right
			case 0:
				new_uvs = [	new THREE.Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
									new THREE.Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
									new THREE.Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)];
				break;
			
			// left
			case 1:
			break;
			
			// top
			case 2:
			break;
			
			// bottom
			case 3:
			break;

		   // front
			case 4:
			break;
			
			// back
			case 5:
			break;
			
			
		}
		
		geometry.faceVertexUvs[0].push(new_uvs);

	}
	geometry.uvsNeedUpdate = true;