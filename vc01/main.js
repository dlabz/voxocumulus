// Default values.
function Globals ()
{
	this.renderMode = "o3d";
}

// Global object has global scope.
var G;

/// We need to find a way to put this inside initMain's renderMode o3d conditional.
o3djs.require("o3djs.util");
o3djs.require("o3djs.math");
o3djs.require("o3djs.effect");
o3djs.require("o3djs.primitives");
o3djs.require("o3djs.rendergraph");
o3djs.require("o3djs.fps");

window.onload = initMain;
window.onunload = uninitMain;

// Primary initialization, meant to be flexible enough to use different renderers.
function initMain()
{
	G = new Globals();
	
	var body = document.body;

	if (G.renderMode == "o3d")
	{
		// Creates the O3D div in the main document.
		var graphicsDiv = document.createElement("div");
		graphicsDiv.setAttribute("id", "o3d");

		graphicsDiv.setAttribute("style", "width: 100%; height: " + window.innerHeight + "px;");
		body.appendChild(graphicsDiv);
		
		o3djs.util.makeClients(initO3D);
	}
}

function uninitMain ()
{
	if (G.renderMode == "o3d" && G.client)
	{
		G.client.cleanup();
	}
}