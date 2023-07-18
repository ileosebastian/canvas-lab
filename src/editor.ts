import { Box, BoxType, GROUND_BOX, OBSTACLE_BOX } from './boxes';

export class Editor {

    canvas!: HTMLCanvasElement;
    context!: CanvasRenderingContext2D;
    columns!: number;
    rows!: number;

    widthTiles!: number;
    heightTiles!: number;

    stage!: Array<Array<Box>>;
    typeGround: string[] = ['user', 'place'];
    typeObstacle: string[] = ['wall', 'door'];

    animation: any;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        let ctx = this.canvas.getContext('2d');
        if (ctx)
            this.context = ctx;

        this.columns = this.canvas.width / 10;
        this.rows = this.canvas.height / 10;

        this.widthTiles = Math.floor(canvas.height / this.rows);
        this.heightTiles = Math.floor(canvas.height / this.rows);

        this.stage = this.create2DMatrix(this.rows, this.columns);

        // fill stage
        for (let c = 0; c < this.columns; c++) { // x
            for (let r = 0; r < this.rows; r++) { // y
                this.stage[c][r] = new Box(c, r, 'ground', { columns: this.columns, rows: this.rows }); // x, y
            }
        }

        // add neighbors for each cell
        this.stage.forEach(column => column.forEach(row => row.addNeighbors(this.stage)));

        this.generateSamplePlane();

        this.generateEditor();
    }

    private create2DMatrix(rows: number, columns: number): Array<Array<Box>> {
        let obj = new Array(columns);

        for (let i = 0; i < obj.length; i++) {
            obj[i] = new Array(rows);
        }

        return obj;
    }

    generateEditor() {
        this.stage.forEach(column =>
            column.forEach(row => {
                this.context.fillStyle = row.color;
                this.context.fillRect(row.x * this.widthTiles, row.y * this.heightTiles, this.heightTiles, this.heightTiles);
            }));
    }

    generateSamplePlane() {
        console.log(this.rows)
        // wall top
        for (let c = 0; c < 30; c++) {
            this.stage[c][14] = new Box(c, 14, 'wall', { columns: this.columns, rows: this.rows });
        }
        for (let c = 0; c < 30; c++) {
            this.stage[c][26] = new Box(c, 26, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let c = 41; c < this.columns; c++) {
            this.stage[c][14] = new Box(c, 14, 'wall', { columns: this.columns, rows: this.rows });
        }
        for (let c = 41; c < this.columns; c++) {
            this.stage[c][26] = new Box(c, 26, 'wall', { columns: this.columns, rows: this.rows });
        }


        for (let r = 0; r < 15; r++) {
            this.stage[30][r] = new Box(30, r, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let r = 26; r < this.rows; r++) {
            this.stage[30][r] = new Box(30, r, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let r = 0; r < 15; r++) {
            this.stage[41][r] = new Box(41, r, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let r = 26; r < this.rows; r++) {
            this.stage[41][r] = new Box(41, r, 'wall', { columns: this.columns, rows: this.rows });
        }

    }

    drawBox(box: Box) {
        this.context.fillStyle = box.color;
        this.context.fillRect(box.x * this.widthTiles, box.y * this.heightTiles, this.heightTiles, this.heightTiles);
    }

    addBox(box: Box) {
        // replace box to obstacle
        this.stage[box.x][box.y] = box;
        this.stage[box.x][box.y].addNeighbors(this.stage);
        // this.stage.forEach(col => col.forEach(row => row.addNeighbors(this.stage)));
    }

    findBox(x: number, y: number): Box | null {
        let box = this.stage.find((col) => {
            // let val = col.find(row => row.x === x && row.y === y);
            return col.find(row => row.x === x && row.y === y)
            // return val?.x === x && val?.y === y;
        })
            ?.find(val => val.x === x && val.y === y);

        // console.log("Se ha encontrado esto: ", box);
        return box || null;
    }

    toggleBox(x: number, y: number, type: BoxType): Box | null {
        let box = this.findBox(x, y);

        if (box) { // if box exist
            // create box
            let newBox = new Box(x, y, type, { columns: this.columns, rows: this.rows });
            // this.stage.forEach(col => col.forEach(row => row.addNeighbors(this.stage)));

            // add box
            this.addBox(newBox);
            this.drawBox(newBox);

            return newBox;
        }

        return null; // the box doesn't find
    }

    async initPathFinding(): Promise<Box[] | null> {
        // check if start(user) and goal(place) is into Editor
        let points: Box[] | undefined = [];
        for (const columns of this.stage) {
            for (const row of columns) {
                if (row instanceof Box && GROUND_BOX.includes(row.type) && row.type !== 'ground')
                    points.push(row);
            }
            if (points.length > 1)
                break;
        }

        // console.log("Los points", points);

        if (points.length < 2 || points.some(val => val === undefined)) {
            console.log("->", points);
            return null;
        }
        console.log(points);

        // init algoritm
        let [f, s] = points;
        // update neighbors
        // this.stage.forEach(col => col.forEach(row => row.addNeighbors(this.stage)));
        // this.stage.forEach(col => col.forEach(row => console.log({...row})));

        // console.log("STAGE antes de entrar al algoritmo: ", this.stage);
        this.stage.forEach(c => c.forEach(r => {
            if (r.type === 'user' || r.type === 'wall' || r.type === 'place')
                console.log(r);
        }))

        if (f.type === 'user')
            // console.log("Start:", f,   "Goal: ", s);
            return await this.astart(f, s);
        else
            // console.log("Start:", s,   "Goal: ", f);
            return await this.astart(s, f);
    }

    clearPath(path: Box[]) {
        // remove animation
        clearInterval(this.animation);

        // clear canvas
        this.drawLines(path, 'white');
        console.log("start", path[0], "end", path[path.length - 1]);

        path.forEach(p => {
            this.context.clearRect(p?.x * this.widthTiles, p?.y * this.heightTiles, this.heightTiles, this.heightTiles)
        });

        // remove start and end object from stage
        this.addBox(new Box(path[0].x, path[0].y, 'ground', { columns: this.columns, rows: this.rows }));
        this.addBox(new Box(path[path.length - 1].x, path[path.length - 1].y, 'ground', { columns: this.columns, rows: this.rows }));
    }

    walkingThePath(path: Box[]) {
        let p = 0;
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw guide lines
        this.animation = setInterval(() => {
            this.drawLines(path, '#1E9AFA');
            if (p >= path.length - 1) {
                p = 0;  // repite animacion
                console.log("entra")
            } else {
                p++;
            }
            let ctx = this.context;
            ctx.clearRect(path[p - 1]?.x * this.widthTiles, path[p - 1]?.y * this.heightTiles, this.heightTiles, this.heightTiles)
            ctx.beginPath();
            ctx.fillStyle = path[p].type === 'ground' ? 'green' : path[p].color;
            ctx.fillRect(path[p].x * this.widthTiles, path[p].y * this.heightTiles, this.heightTiles, this.heightTiles)
            ctx.closePath();
        }, 1000 / 10);
    }

    drawLines(path: Box[], color: string) {
        let ctx = this.context;

        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(0, 4);
        this.context.strokeStyle = 'brown';
        this.context.lineWidth = 3;
        this.context.stroke();

        let center = 4;
        ctx.beginPath();
        ctx.moveTo(path[0].x * this.widthTiles + center, path[0].y * this.heightTiles + center);
        ctx.lineTo(path[1].x * this.widthTiles + center, path[1].y * this.heightTiles + center);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        path.forEach((p, index) => {
            if (index > 0) {
                ctx.beginPath();
                ctx.moveTo(path[index - 1].x * this.widthTiles + center, path[index - 1].y * this.heightTiles + center);
                ctx.lineTo(path[index].x * this.widthTiles + center, path[index].y * this.heightTiles + center);
                ctx.strokeStyle = color;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
        });
    }

    private heuristic(firstbox: Box, secondbox: Box): number {
        let x = Math.abs(firstbox.x - secondbox.x);
        let y = Math.abs(firstbox.y - secondbox.y);

        return (x + y);
    }

    private getBoxWithLowestFScore(boxes: Box[], fScore: Map<Box, number>): Box {
        let lowestBox = boxes[0];
        let lowestFScore = fScore.get(lowestBox) || 0;

        for (let i = 1; i < boxes.length; i++) {
            const box = boxes[i];
            const boxFScore = fScore.get(box) || 0;

            if (boxFScore < lowestFScore) {
                lowestBox = box;
                lowestFScore = boxFScore;
            }
        }

        return lowestBox;
    }

    reconstructPath(cameFrom: Map<Box, Box>, current: Box): Box[] {
        const total_path = [current];

        while (cameFrom.has(current)) {
            current = <Box>cameFrom.get(current);
            total_path.unshift(current);
        }

        return total_path;
    }

    async astart(start: Box, goal: Box): Promise<Box[] | null> {
        console.log("ENTRA AL ALGORITMO");
        const openSet = [start];
        const cameFrom = new Map<Box, Box>();
        const gScore = new Map<Box, number>();
        const fScore = new Map<Box, number>(); // f(n) = g(n) + h(n)

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (openSet.length > 0) { // while open set its not empty
            const current = this.getBoxWithLowestFScore(openSet, fScore);

            console.log("VECINOS DE CURRENT: ", current.neighbors);

            if (current === goal) {
                console.log("encontrado");
                return this.reconstructPath(cameFrom, current);
            }

            openSet.splice(openSet.indexOf(current), 1); // remove one element, the current box

            for (let neighbor of current.neighbors) {
                let box = this.findBox(neighbor.x, neighbor.y);

                if (box?.type !== 'wall') {
                    box?.addNeighbors(this.stage);
                    if (box?.type === 'place' || box?.type === 'user' || (!box?.neighbors.some(b => b.type === 'wall'))) {
                        const tentativeGScore = gScore.get(current) || 0 + this.heuristic(current, neighbor);
                        console.log("el tentative score es ", neighbor, "->", tentativeGScore, " < ", gScore.get(neighbor), "no hay", !gScore.has(neighbor));

                        // if (!gScore.has(neighbor) || tentativeGScore < (gScore.get(neighbor) || -1)) {
                        if (tentativeGScore < (gScore.get(neighbor) || 0)) {

                            cameFrom.set(neighbor, current);
                            // console.log("Agregado a la ruta ->", neighbor, "valor de", current)
                            gScore.set(neighbor, tentativeGScore);
                            fScore.set(neighbor, tentativeGScore + this.heuristic(neighbor, goal)); // heuristic

                            if (!openSet.includes(neighbor)) {
                                openSet.push(neighbor);
                            }
                        }
                    }
                } 
            }
        }

        console.log("NO ENCONTRO NA", goal);
        return null;
    }

}