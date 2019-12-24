
var WIDTH = 9;
var HEIGHT = 6;
var TILE_SIZE = 50;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCoords(elem) { 
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}

class Grid {

	constructor() {
		this.width = WIDTH;
		this.height = HEIGHT;
		this.count_full_cells = 0;
	}

	create_grid() {
		let grid_elem = document.querySelector(".grid");
		grid_elem.innerHTML = "";
		for (let i = 0; i < this.height; i++) {
			grid_elem.innerHTML += "<div class='row row_" + i + "'>";
			for (let j = 0; j < this.width; j++) {
				grid_elem.innerHTML += "<div class='cell cell_" + i + j + "'></div>";
			}
			grid_elem.innerHTML += "</div>";
		}
	}
}


class TileStorage {

	constructor(file) {
		this.width = WIDTH;
		this.height = HEIGHT;
		this.img_path = "img/" + file;
		this.grid = new Grid();
		this.zIndex = 1000;
	}

	generate_tiles() {

		let storage_elem = document.querySelector(".tiles_place");
		storage_elem.innerHTML = "";
		let tile;
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width	; j++) {
				tile = document.createElement('div');
				tile.className = "tile tile_" + i + j;
				tile.style.top = random(getCoords(storage_elem).top + TILE_SIZE, getCoords(storage_elem).top + window.innerHeight - TILE_SIZE)+"px";
				tile.style.left = random(getCoords(storage_elem).left + TILE_SIZE, getCoords(storage_elem).left + window.innerWidth*0.4 - TILE_SIZE)+"px";
				this.make_background(tile, -50*j, -50*i);	
				this.addEvent(tile);
				storage_elem.append(tile);	
			}
		}
	}

	addEvent(elem) {
		elem.onmousedown = (e) => {
			elem.ondragstart = function() {
 				return false;
			};
			//document.body.appendChild(elem);
			elem.style.zIndex = this.zIndex++;
			elem.style.left = e.pageX - elem.offsetWidth / 2 + 'px';
    		elem.style.top = e.pageY - elem.offsetHeight / 2 + 'px';
    		document.onmousemove = (e) => {
				elem.style.left = e.pageX - elem.offsetWidth / 2 + 'px';
	    		elem.style.top = e.pageY - elem.offsetHeight / 2 + 'px';
			};
		};
		document.onmouseup = (e) => {
			document.onmousemove = null;
    		elem.onmouseup = null;
    		let elems = document.elementsFromPoint(event.pageX, event.pageY);
    		for (let i = 1; i < elems.length; i++) {
    			if (elems[i].classList.contains("tiles_place"))
    				return;
    			else if (elems[i].classList.contains("cell")){
    				let num_cell = elems[i].classList[1].split("_")[1];
    				let num_tile = elems[0].classList[1].split("_")[1];
    				if (num_tile == num_cell){
    					elems[0].onmousedown = null;
    					elems[0].style.display = "flex";
    					elems[0].style.top = "";
    					elems[0].style.left = "";
    					elems[i].append(elems[0]);
    					this.grid.count_full_cells += 1;
    					break;
    				}
    				else {
    					let storage_elem = document.querySelector(".tiles_place");
    					elems[0].style.top = random(getCoords(storage_elem).top + TILE_SIZE, getCoords(storage_elem).top + window.innerHeight - TILE_SIZE)+"px";
						elems[0].style.left = random(getCoords(storage_elem).left + TILE_SIZE, getCoords(storage_elem).left + window.innerWidth*0.4 - TILE_SIZE)+"px";
    				}
    			}
			}
			if (this.grid.count_full_cells == this.width*this.height)
				document.dispatchEvent(new Event("endgame"));

	};
}
	make_background(elem, offsetX, offsetY) {
		elem.style.backgroundImage = "url(" + this.img_path + ")";
		elem.style.backgroundPosition = offsetX + "px " + offsetY + "px";
		console.log(elem.style.backgroundPosition);
	}
}


let num_of_picture = random(0, 5);
var tile_storage = new TileStorage(num_of_picture  + ".jpg");
document.addEventListener("DOMContentLoaded", () => {
	tile_storage.generate_tiles();
	tile_storage.grid.create_grid();
	document.querySelector(".grid").style.background = 'url("img/' + num_of_picture + '.jpg"), rgba(255, 255, 255, 0.6)';
})


document.addEventListener("endgame", (e) => {
	num_of_picture = random(0, 5);
	tile_storage = new TileStorage(num_of_picture  + ".jpg");
	tile_storage.generate_tiles();
	tile_storage.grid.create_grid();
	document.querySelector(".grid").style.background = 'url("img/' + num_of_picture + '.jpg"), rgba(255, 255, 255, 0.6)';
});