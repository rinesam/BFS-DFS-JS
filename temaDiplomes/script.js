
canvas = document.getElementsByTagName("canvas")[0];
ctx = canvas.getContext("2d");
const WIDTH = 600;
const HEIGHT = 600;
canvas.width = WIDTH;
canvas.height = HEIGHT;

var Cell = function(cellType){
    this.value = cellType;
    this.row = null;
    this.column = null;
    this.distance = null;
    this.pred = null;
    this.bfsColor = "white";
    this.dfsColor = "white";
};

Cell.prototype.getColor = function() {
    switch(this.value) {
        case "#": return "#555555"; // muret
        case " ": return "#DDDDDD"; // hapsira
        case "S": return "#4285F4"; // starti
        case "E": return "#34A853"; // fundi
        case "P": return "#EB4335"; // pathi
        case "V": return "orange";//e vizitune amo sosht pathi perfundimtar
        default:  return "#FBBC05"; // yellow
    }
};
// maze
Cell.prototype.draw = function(ctx, x, y, width, height) {
    ctx.fillStyle = this.getColor();
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = "#000000"; // Black border for each cell
    ctx.strokeRect(x, y, width, height);
};


Cell.prototype.setPos = function(row, col){
    this.row = row;
    this.col = col;
};

Cell.prototype.getNeighbors = function(){
   
    let row = this.row;
    let col = this.col;
    return [[row-1, col], [row+1, col], [row, col-1], [row, col+1]];
};

Cell.prototype.setDistance = function(distance){
    this.distance = distance;
};

Cell.prototype.getDistance = function(){
    return this.distance;
};

Cell.prototype.getBFSColor = function(){
    return this.bfsColor;
};

Cell.prototype.setBFSColor = function(color){
    this.bfsColor = color;
};

Cell.prototype.getDFSColor = function(){
    return this.dfsColor;
};

Cell.prototype.setDFSColor = function(color){
    this.dfsColor = color;
};

Cell.prototype.setPred = function(pred){
    this.pred = pred;
};

Cell.prototype.getPred = function(){
    return this.pred;
};

var Maze = function(){
    this.contents = [];
    this.start = null;
    this.end = null;
};

Maze.prototype.initContents = function(desiredRes){
    
    for (let i = 0; i < desiredRes; i++){
        this.contents.push([])
        for (let j = 0; j < desiredRes; j++){
            if (i == 0 || i == (desiredRes-1) || j == 0 || j == (desiredRes-1)){
                let cell = new Cell("#");
                cell.setPos(i, j);
                this.contents[i].push(cell);
            }
            else{
                let cell = new Cell(" ");
                cell.setPos(i, j);
                this.contents[i].push(cell);
            }
        }
    }
};




document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('popup-overlay').style.display = 'flex';

//default size to be generated too
    let defaultSize = 10; 
    size.value = defaultSize; 
    generator(); 
});

document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('popup-overlay').style.display = 'none';
});

Maze.prototype.generator = function([x1, x2], [y1, y2], desiredRes){
	let width = x2 - x1;
	let height = y2 - y1;
	if (width >= height){
		
		if(x2-x1>3){
			let bisection = Math.ceil((x1+x2)/2);
			let max = y2-1;
			let min = y1+1;
			let randomPassage = Math.floor(Math.random() * (max - min + 1)) + min;
			let first = false;
			let second = false;
			if (this.contents[y2][bisection].value == " "){
				randomPassage = max;
				first = true;
			}
			if (this.contents[y1][bisection].value == " "){
				randomPassage = min;
				second = true;
			}
			for (let i = y1+1; i < y2; i++){
				if (first && second){
					if (i == max || i == min){
						continue;
					}
				}
				else if (i == randomPassage){
					continue;
				}
				this.contents[i][bisection].value = "#";
			}
			this.generator([x1, bisection],[y1, y2], desiredRes);
			this.generator([bisection, x2],[y1, y2], desiredRes);
		}
	}
	else{
		
		if (y2-y1 > 3){
			let bisection = Math.ceil((y1+y2)/2);
			let max = x2-1;
			let min = x1+1;
			let randomPassage = Math.floor(Math.random() * (max - min + 1)) + min;
			let first = false;
			let second = false;
			if (this.contents[bisection][x2].value == " "){
				randomPassage = max;
				first = true;
			}
			if (this.contents[bisection][x1].value == " "){
				randomPassage = min;
				second = true;
			}
			for (let i = x1+1; i < x2; i++){
				if (first && second){
					if (i == max || i == min){
						continue;
					}
				}
				else if (i == randomPassage){
					continue;
				}
				this.contents[bisection][i].value = "#";
			} 
			this.generator([x1, x2],[y1, bisection], desiredRes);
			this.generator([x1, x2],[bisection, y2], desiredRes);
		}
	}
};
 

Maze.prototype.render = function(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    let cellWidth = WIDTH / this.contents[0].length;
    let cellHeight = HEIGHT / this.contents.length;

    for (let row = 0; row < this.contents.length; row++) {
        for (let col = 0; col < this.contents[0].length; col++) {
            let cell = this.contents[row][col];
            cell.draw(ctx, col * cellWidth, row * cellHeight, cellWidth, cellHeight);
        }
    }
};


Maze.prototype.getEmptySlots = function(){
    let emptySlots = [];
    for (let row = 0; row < this.contents.length; row++){
        for (let col = 0; col < this.contents[0].length; col++){
            if (this.contents[row][col].value == " "){
                emptySlots.push(this.contents[row][col]);
            }
        }
    }
    return emptySlots;
};

Maze.prototype.initPoints = function(){
    let emptySlots = this.getEmptySlots();
    if (emptySlots.length > 1){
        this.start = emptySlots[0];
        this.end = emptySlots[emptySlots.length-1];
        this.start.value = "S";
        this.end.value = "E";
    }
};
/*me u resetu solve mas gjdo here qe thirret*/ 
Maze.prototype.reset = function() {
    for (let row of this.contents) {
        for (let cell of row) {
            cell.bfsColor = "white";
            cell.dfsColor = "white";
            cell.pred = null;
            if (cell.value === "P"|| cell.value === "V") {
                cell.value = " ";
            }
        }
    }
    if (this.start) {
        this.start.value = "S";
    }
    if (this.end) {
        this.end.value = "E";
    }
    this.render();
};


Maze.prototype.clearSolution = function(){
    for (let row of this.contents){
        for (let element of row){
            if (element.value == "P"|| element.value == "V"){
                element.value = " ";
            }
        }
    }
    if (this.start) {
        this.start.value = "S";
    }
    if (this.end) {
        this.end.value = "E";
    }
    this.render();
};
Maze.prototype.shortestBFS = function() {
    this.reset();
    let start = this.start;
    start.setDistance(0);
    start.setPred(null);
    let cellQueue = [];
    cellQueue.push(start);

    const processCell = () => {
        if (cellQueue.length === 0) {
            return; // No more cells to process
        }

        let currentCell = cellQueue.shift();
        if (currentCell === this.end) {
            this.traceBackPathBFS(); // Trace back the path
            return; // End reached
        }

        let neighbors = currentCell.getNeighbors();
        for (let neighbor of neighbors) {
            let row = neighbor[0];
            let col = neighbor[1];
            if (row >= 0 && col >= 0 && row < this.contents.length && col < this.contents[0].length) {
                let nextCell = this.contents[row][col];
                if (nextCell.value !== "#" && nextCell.getBFSColor() === "white") {
                    nextCell.setBFSColor("gray");
                    nextCell.value = "V"; // Mark as visited (orange)
                    nextCell.setPred(currentCell);
                    cellQueue.push(nextCell);
                }
            }
        }
        currentCell.setBFSColor("black");
        this.render(); // Render the current state of the maze

        requestAnimationFrame(processCell); // Schedule next cell
    };

    processCell(); // Start the process
};
Maze.prototype.traceBackPathBFS = function() {
    let currentCell = this.end;
    let path = [];

    while (currentCell !== this.start && currentCell != null) {
        path.push(currentCell);
        currentCell = currentCell.getPred();
    }

    const animatePath = () => {
        if (path.length === 0) {
            this.start.value = "S"; // Ensure start point is visible
            this.end.value = "E";   // Ensure end point is visible
            this.render(); // Final render
            return; // No more cells in the path
        }

        let cell = path.pop();
        if (cell !== this.start && cell !== this.end) {
            cell.value = "P"; // Set path cell to 'P' (for red color)
        }
        this.render(); // Render the current state of the maze

        requestAnimationFrame(animatePath); // Schedule next cell
    };

    animatePath(); // Start animating the path
};

Maze.prototype.shortestDFS = function() {
    this.reset();
    let start = this.start;
    let cellStack = [];
    cellStack.push(start);

    const processCell = () => {
        if (cellStack.length === 0) {
            this.traceBackPathDFS();
            return;
        }

        let currentCell = cellStack.pop();
        if (currentCell === this.end) {
            this.traceBackPathDFS();
            return;
        }
        if (currentCell.getDFSColor() === "white") {
            // Prevent changing the start cell's appearance
            if (currentCell !== this.start) {
                currentCell.setDFSColor("gray");
                currentCell.value = "V"; // Mark as visited (orange)
            }

            let neighbors = currentCell.getNeighbors();
            for (let neighbor of neighbors) {
                let row = neighbor[0];
                let col = neighbor[1];
                if (row >= 0 && col >= 0 && row < this.contents.length && col < this.contents[0].length) {
                    let nextCell = this.contents[row][col];
                    if (nextCell.value !== "#" && nextCell.getDFSColor() === "white") {
                        nextCell.setPred(currentCell);
                        cellStack.push(nextCell);
                    }
                }
            }
        }
        this.render();
        requestAnimationFrame(processCell);
    };

    processCell();
};

Maze.prototype.traceBackPathDFS = function() {
    let currentCell = this.end;
    let path = [];

    while (currentCell !== this.start && currentCell != null) {
        path.push(currentCell);
        currentCell = currentCell.getPred();
    }

    const animatePath = () => {
        if (path.length === 0) {
            this.start.value = "S"; // Ensure start point is visible
            this.end.value = "E";   // Ensure end point is visible
            this.render(); // Final render
            return; // No more cells in the path
        }

        let cell = path.pop();
        if (cell !== this.start && cell !== this.end) {
            cell.value = "P"; // Set path cell to 'P' (for red color)
        }
        this.render(); // Render the current state of the maze

        requestAnimationFrame(animatePath); // Schedule next cell
    };

    animatePath(); // Start animating the path
};




let generate = document.getElementById("generate");
let size = document.getElementById("size");
let solve = document.getElementById("solve");
let solve2 = document.getElementById("solve2"); // For DFS
let clear = document.getElementById("clear");

myMaze = null;



function generator(){
    genSize = parseInt(size.value);
    if (genSize && genSize >= 5 && genSize <= 100) { //pyte profen sa osht ma mire me lon!!!
        myMaze = new Maze();
        myMaze.initContents(genSize);
        myMaze.generator([0, genSize-1], [0, genSize-1], genSize);
        myMaze.initPoints();
        myMaze.render();
    }
}

// Evnt listener for size input 
size.addEventListener('input', function() {
    if(this.value !== '') {
        generator();
    }
});





solve.addEventListener("click", function() {
    myMaze.shortestBFS();
    let currentCell = myMaze.start.getPred();
    function animate() {
        if (currentCell && currentCell != myMaze.end) {
            myMaze.bfsTraverse(currentCell);
            currentCell = currentCell.getPred();
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
});

solve2.addEventListener("click", function() {
    myMaze.shortestDFS();
    let currentCell = myMaze.end;
    let path = [currentCell];
    while (currentCell !== myMaze.start && currentCell.getPred() !== null) {
        currentCell = currentCell.getPred();
        path.unshift(currentCell);
    }

    function animate() {
        if (path.length > 0) {
            currentCell = path.shift();
            if (currentCell) {
                myMaze.dfsTraverse(currentCell);
                requestAnimationFrame(animate);
            }
        }
    }
    requestAnimationFrame(animate);
});


clear.addEventListener("click", function(){
    myMaze.clearSolution();
    myMaze.render();
});

//gjuhet


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('language-popup').style.display = 'flex';
    document.getElementById('popup-overlay').style.display = 'none';

    document.getElementById('select-language').addEventListener('click', function() {
        var selectedLanguage = document.getElementById('language-dropdown').value;
        loadLanguage(selectedLanguage).then(() => {
            document.getElementById('language-popup').style.display = 'none';
            document.getElementById('popup-overlay').style.display = 'flex';
        });
    });

    function loadLanguage(lang) {
        return fetch('translations/' + lang + '.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('select').textContent = data.select;
                document.getElementById('select-language').textContent = data['select-language']; 
                document.getElementById('Welcome').textContent = data.welcome;
                document.getElementById('embark').textContent = data.embark;
                document.getElementById('how_to_play').textContent = data.how_to_play.title;
                document.getElementById('generate0').innerHTML = data.how_to_play.generate0;
                document.getElementById('solve0').innerHTML = data.how_to_play.solve0;
                document.getElementById('challenge').innerHTML = data.how_to_play.challenge;
                document.getElementById('can_you').textContent = data.how_to_play.can_you;
                
                document.getElementById('start-game').textContent = data['start-game'];
                document.getElementById('size').textContent = data.size;
                document.getElementById('generate').textContent = data.generate;
                document.getElementById('solve').textContent = data.solve;
                document.getElementById('solve2').textContent = data.solve2;
                document.getElementById('clear').textContent = data.clear;
            });
    }

    loadLanguage('en'); // Load lang by default
});
