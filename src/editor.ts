import { Box, BoxType, GROUND_BOX } from './boxes';

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
    imageLocation!: HTMLImageElement;
    imageUser!: HTMLImageElement;
    imgU0!: HTMLImageElement;
    imgU45!: HTMLImageElement;
    imgU90!: HTMLImageElement;
    imgU135!: HTMLImageElement;
    imgU180!: HTMLImageElement;
    imgU225!: HTMLImageElement;
    imgU270!: HTMLImageElement;
    imgU315!: HTMLImageElement;
    spritesUser!: Map<string, HTMLImageElement>;

    routName: string[] = [
        'user0',
        'user45',
        'user90',
        'user135',
        'user180',
        'user225',
        'user270',
        'user315',
    ];
    imgFloor = new Image();

    stairImage!: HTMLImageElement;

    showMiddleObstacle!: boolean;
    showGuidelines!: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        let ctx = this.canvas.getContext('2d');
        if (ctx)
            this.context = ctx;

        this.imgFloor.src = `../floor-location.svg`;
        this.columns = this.canvas.width / 10;
        this.rows = this.canvas.height / 10;

        this.widthTiles = Math.floor(canvas.height / this.rows);
        this.heightTiles = Math.floor(canvas.height / this.rows);

        let img;
        this.spritesUser = new Map();

        img = new Image();
        img.src = `../public/user.svg`;
        // img.width = this.widthTiles;
        // img.height = this.heightTiles;
        this.imageUser = img;

        img = new Image();
        img.src = `../public/location.svg`;
        this.imageLocation = img;

        this.routName.forEach(route => {
            img = new Image(this.widthTiles, this.heightTiles);
            img.src = `../public/${route}.svg`;

            this.spritesUser.set(route, img);
        });
        this.stage = this.create2DMatrix(this.rows, this.columns);

        // fill stage
        for (let c = 0; c < this.columns; c++) { // x
            for (let r = 0; r < this.rows; r++) { // y
                this.stage[c][r] = new Box(c, r, 'ground', { columns: this.columns, rows: this.rows }); // x, y
            }
        }

        // add neighbors for each cell
        this.stage.forEach(column => column.forEach(row => row.addNeighbors(this.stage)));

        img = new Image();
        img.src = `../public/stair.svg`;
        this.stairImage = img;

        this.showMiddleObstacle = true;
        this.generateSamplePlane();

        this.showGuidelines = true;
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
        
        this.stage.forEach((column) =>{
            column.forEach((row) => {
                if (this.showGuidelines) {
                    let center = 5;
                    if (row.x === Math.floor(this.columns/2)) {
                        this.context.moveTo(row?.x * this.widthTiles+center, row?.y*this.heightTiles);
                        this.context.lineTo(row.x*this.widthTiles+center, (row.y+1)*this.heightTiles);
                        this.context.strokeStyle = 'blue';
                        this.context.lineWidth = 1;
                        this.context.stroke();
                    } 
                    if (row.y === Math.floor(this.rows/2)) {
                        this.context.moveTo(row?.x * this.widthTiles, row?.y*this.heightTiles+center);
                        this.context.lineTo((row.x+1)*this.widthTiles, (row.y)*this.heightTiles+center);
                        this.context.strokeStyle = 'blue';
                        this.context.lineWidth = 1;
                        this.context.stroke();
                    }
                }
                
                this.context.fillStyle = row.color;
                this.context.fillRect(row.x * this.widthTiles, row.y * this.heightTiles, this.heightTiles, this.heightTiles);
            });
        });
    }

    generateSamplePlane() {
        // wall top
        for (let c = 0; c < 30; c++) {
            this.stage[c][11] = new Box(c, 11, 'wall', { columns: this.columns, rows: this.rows });
        }
        for (let c = 0; c < 30; c++) {
            this.stage[c][20] = new Box(c, 20, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let c = 34; c < this.columns; c++) {
            this.stage[c][11] = new Box(c, 11, 'wall', { columns: this.columns, rows: this.rows });
        }
        for (let c = 41; c < this.columns; c++) {
            this.stage[c][20] = new Box(c, 20, 'wall', { columns: this.columns, rows: this.rows });
        }

        let typeBox: BoxType = this.showMiddleObstacle ? 'wall' : 'ground';
        if (this.showMiddleObstacle) {
            
        }
            for (let c = 0; c < 5; c++) {
                this.stage[c][15] = new Box(c, 15, typeBox, { columns: this.columns, rows: this.rows });
                this.stage[c][16] = new Box(c, 16, typeBox, { columns: this.columns, rows: this.rows });
            }

            for (let c = 10; c < 16; c++) {
                this.stage[c][15] = new Box(c, 15, typeBox, { columns: this.columns, rows: this.rows });
                this.stage[c][16] = new Box(c, 16, typeBox, { columns: this.columns, rows: this.rows });
            }

            for (let c = 21; c < 27; c++) {
                this.stage[c][15] = new Box(c, 15, typeBox, { columns: this.columns, rows: this.rows });
                this.stage[c][16] = new Box(c, 16, typeBox, { columns: this.columns, rows: this.rows });
            }


            for (let c = 45; c < 51; c++) {
                this.stage[c][15] = new Box(c, 15, typeBox, { columns: this.columns, rows: this.rows });
                this.stage[c][16] = new Box(c, 16, typeBox, { columns: this.columns, rows: this.rows });
            }

            for (let c = 55; c < 61; c++) {
                this.stage[c][15] = new Box(c, 15, typeBox, { columns: this.columns, rows: this.rows });
                this.stage[c][16] = new Box(c, 16, typeBox, { columns: this.columns, rows: this.rows });
            }

            for (let c = this.columns - 5; c < this.columns; c++) {
                this.stage[c][15] = new Box(c, 15,typeBox, { columns: this.columns, rows: this.rows });
                this.stage[c][16] = new Box(c, 16, typeBox, { columns: this.columns, rows: this.rows });
            }
        

        for (let r = 0; r < 12; r++) {
            this.stage[30][r] = new Box(30, r, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let r = 20; r < this.rows; r++) {
            this.stage[30][r] = new Box(30, r, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let r = 0; r < 12; r++) {
            this.stage[41][r] = new Box(41, r, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let r = 21; r < this.rows; r++) {
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

        return box || null;
    }

    toggleBox(x: number, y: number, type: BoxType): Box | null {
        let box = this.findBox(x, y);

        if (box) { // if box exist
            // create box
            let newBox = new Box(x, y, type, { columns: this.columns, rows: this.rows });

            // add box
            this.addBox(newBox);
            if (newBox.type === 'user') {
                this.drawBox(newBox);
                this.context.drawImage(this.stairImage, 320, 150);
            } else {
                this.drawBox(newBox);
            }

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

        if (points.length < 2 || points.some(val => val === undefined)) {
            return null;
        }

        // init algoritm
        let [f, s] = points;
        // update neighbors
        this.stage.forEach(col => col.forEach(row => row.addNeighbors(this.stage)))

        if (f.type === 'user') {
            return await this.astart(f, s);

            // return await routeStatic(f, s, this.columns, this.rows);
        } else {
            return await this.astart(s, f);
            // return await routeStatic(s, f, this.columns, this.rows);
        }
    }

    c: number = 7;
    clearPath(path: Box[]) {
        // remove animation
        clearInterval(this.animation);

        // clear canvas
        this.drawLines(path, 'white', 5);
        this.context.closePath();

        path.forEach(p => {
            this.context.clearRect(p?.x * this.widthTiles - this.c, p?.y * this.heightTiles - this.c, this.imageUser.width, this.imageUser.height)
        });

        // remove start and end object from stage
        this.addBox(new Box(path[0].x, path[0].y, 'ground', { columns: this.columns, rows: this.rows }));
        this.addBox(new Box(path[path.length - 1].x, path[path.length - 1].y, 'ground', { columns: this.columns, rows: this.rows }));
        this.context.clearRect(320, 150, this.stairImage.width, this.stairImage.height);

        this.generateEditor();
    }

    animateGoal(x: number, y: number) {

        let positionX = x - 10;
        let positionY = y - 13;

        let xGrowth = 0;
        let yGrowth = 0;

        setInterval(() => {
            if (xGrowth > 10) return;

            this.context.beginPath();

            // floor
            this.context.drawImage(
                this.imgFloor,
                positionX - (xGrowth > 0 ? (xGrowth / 2) : 0),
                // positionY* (yGrowth+1),
                positionY,
                (this.imgFloor.width + 10) + xGrowth,
                (this.imgFloor.height + 5) + yGrowth
            );

            this.context.drawImage(
                this.imageLocation,
                positionX + 7 - (xGrowth > 0 ? (xGrowth / 2) : 0),
                positionY - 23,
                (this.imageLocation.width) + xGrowth,
                (this.imageLocation.height + 8) + yGrowth
            );
            xGrowth = xGrowth + 1;
            yGrowth = yGrowth + 0.3;

            this.context.closePath();
        }, 1000 / 26);

        this.context.globalCompositeOperation = 'source-over';
    }

    walkingThePathWithLines(path: Box[]) {
        let index = 0;
        let ctx = this.context;
        let center = 5;
        let color = '#1E9AFA';
        let lineWidth = 1;

        // let middleCol = Math.floor(this.columns / 2);
        let middleRow = Math.floor(this.rows / 2);

        this.animation = setInterval(() => {
            if (index >= path.length - 1) {
                clearInterval(this.animation);
                let x = path[path.length - 1].x * this.widthTiles;
                let y: number;
                // to show locate animation top or bottom with respecto to goal
                // if (path[0].y - path[path.length - 1].y >= 0) {
                if (path[path.length - 1].y < middleRow) {
                    y = path[path.length - 1].y * this.heightTiles - this.heightTiles;
                } else {
                    y = path[path.length - 1].y * this.heightTiles + (this.heightTiles * 6);
                }
                this.animateGoal(x, y)
                setTimeout(() => {
                    ctx.clearRect(
                        x - 15, y - 38,
                        this.imageLocation.width * 2.6,
                        this.imageLocation.height * 1.9
                    );
                    index = 0;
                    this.drawLines(path, 'white', 5);
                    this.context.drawImage(this.stairImage, 320, 150);
                    this.generateEditor();
                    this.walkingThePathWithLines(path);
                }, 700);
            } else {
                index++;
            }

            if ((index + 1) !== path.length - 1 && path[index + 1] && this.correctTrajectory(path[index - 1], path[index + 1])) {
                this.drawLine(path[index - 1], path[index + 1], center, color, lineWidth, ctx);
                index++;
            } else {
                this.drawLine(path[index - 1], path[index], center, color, lineWidth, ctx);
            }

        }, 1000 / 10);
    }

    drawLine(previous: Box, next: Box, center: number, color: string, lineWidth: number, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(previous?.x * this.widthTiles + center, previous?.y * this.heightTiles + center);
        ctx.lineTo(next.x * this.widthTiles + center, next.y * this.heightTiles + center);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
    }

    correctTrajectory(prevPath: Box, nextPath: Box): boolean {
        // esquina superior derecha
        if (prevPath.x + 1 === nextPath.x && prevPath.y - 1 === nextPath.y) {
            return true;
        }

        // esquina inferior derecha
        if (prevPath.x + 1 === nextPath.x && prevPath.y + 1 === nextPath.y) {
            return true;
        }

        // esquina inferior izquierda 
        if (prevPath.x - 1 === nextPath.x && prevPath.y + 1 === nextPath.y) {
            return true;
        }

        // esquina superior izquierda 
        if (prevPath.x - 1 === nextPath.x && prevPath.y - 1 === nextPath.y) {
            return true;
        }

        return false; // no hay que corregir trayectoria
    }

    changeSprite(resX: number, resY: number): string {
        let coor: string = `${resX},${resY}`;
        const SPRITE_BY_COORDINATES: { [key: string]: string } = {
            '1,0': 'user0',
            '1,-1': 'user45',
            '0,-1': 'user90',
            '-1,-1': 'user135',
            '-1,0': 'user180',
            '-1,1': 'user225',
            '0,1': 'user270',
            '1,1': 'user315',
        };

        return SPRITE_BY_COORDINATES[coor] || 'no hay';
    }

    drawLines(path: Box[], color: string, lineWidth: number) {
        let ctx = this.context;

        let center = 4;
        ctx.beginPath();
        ctx.moveTo(path[0].x * this.widthTiles + center, path[0].y * this.heightTiles + center);
        ctx.lineTo(path[1].x * this.widthTiles + center, path[1].y * this.heightTiles + center);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        path.forEach((p, index) => {
            if (index > 0) {
                ctx.beginPath();
                ctx.moveTo(path[index - 1].x * this.widthTiles + center, path[index - 1].y * this.heightTiles + center);
                ctx.lineTo(path[index].x * this.widthTiles + center, path[index].y * this.heightTiles + center);
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
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

    reconstructPath(cameFrom: Map<Box, Box>, current: Box, goal: Box): Box[] {
        const total_path = [current];

        while (cameFrom.has(current)) {
            current = <Box>cameFrom.get(current);
            total_path.unshift(current);
        }

        total_path.push(goal);

        return total_path;
    }

    async astart(start: Box, goal: Box): Promise<Box[] | null> {
        const openSet = [start];
        const cameFrom = new Map<Box, Box>();
        const gScore = new Map<Box, number>();
        const fScore = new Map<Box, number>(); // f(n) = g(n) + h(n)

        // let middleCol = Math.floor(this.columns / 2);
        let middleRow = Math.floor(this.rows / 2);
        let realGoal = goal;
        
        // arriba
        if (goal.y > middleRow) {
            goal = goal.neighbors.filter(n => n.x === goal.x && n.y < goal.y).pop() || goal;
        }

        // abajo
        if (goal.y < middleRow) {
            if (goal.neighbors.filter(n => n.type === 'wall' && n.y > goal.y).length > 0) {
                // alert('poner el goal arriba')
                let possible = goal.neighbors.filter(n => n.x === goal.x && n.y < goal.y).pop() || goal;
                goal = possible;
            } else {
                let possible = goal.neighbors.filter(n => n.x === goal.x && n.y > goal.y).pop() || goal;
                goal = possible;
            }
        }

        // izquierda
        if ((goal.y === start.y && goal.x > start.x) || (goal.x === this.columns-1)) {
            goal = goal.neighbors.filter(n => n.y === goal.y && n.x < goal.x).pop() || goal;
        }

        // derecha
        if ((goal.x === 0) || goal.y === start.y && goal.x < start.x) {
            goal = goal.neighbors.filter(n => n.y === goal.y && n.x > goal.x).pop() || goal;
        }

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (openSet.length > 0) { // while open set its not empty
            const current = this.getBoxWithLowestFScore(openSet, fScore);

            if (current === goal) {
                return this.reconstructPath(cameFrom, current, realGoal);
            }

            openSet.splice(openSet.indexOf(current), 1); // remove one element, the current box

            for (let neighbor of current.neighbors) {
                let box = this.findBox(neighbor.x, neighbor.y);

                if (box?.type !== 'wall') { // discard boxes for the tour
                    box?.addNeighbors(this.stage);
                    if (box?.type === 'place' || box?.type === 'user' || (!box?.neighbors.some(b => b.type === 'wall'))) {
                        const tentativeGScore = gScore.get(current) || 0 + this.heuristic(current, neighbor);

                        if (!gScore.has(neighbor) || tentativeGScore < (gScore.get(neighbor) || -1)) {

                            cameFrom.set(neighbor, current);
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

        return null;
    }

}