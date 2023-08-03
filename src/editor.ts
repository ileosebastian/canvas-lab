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
        // alert(this.stage.length + " - " + this.stage[0].length)
        // wall top
        for (let c = 0; c < 30; c++) {
            this.stage[c][11] = new Box(c, 11, 'wall', { columns: this.columns, rows: this.rows });
        }
        for (let c = 0; c < 30; c++) {
            this.stage[c][20] = new Box(c, 20, 'wall', { columns: this.columns, rows: this.rows });
        }

        for (let c = 41; c < this.columns; c++) {
            this.stage[c][11] = new Box(c, 11, 'wall', { columns: this.columns, rows: this.rows });
        }
        for (let c = 41; c < this.columns; c++) {
            this.stage[c][20] = new Box(c, 20, 'wall', { columns: this.columns, rows: this.rows });
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

        // this.context.drawImage(this.stairImage, this.stage[41][20].x * this.widthTiles, this.stage[41][20].y * this.heightTiles);
        console.log("entra")
    }

    drawBox(box: Box) {
        this.context.fillStyle = box.color;
        this.context.fillRect(box.x * this.widthTiles, box.y * this.heightTiles, this.heightTiles, this.heightTiles);
    }

    drawImg(box: Box) {
        console.log("entra a funcion dibujar img")
        try {
            if (this.spritesUser.has('user0') && this.spritesUser.get('user0')) {
                this.context.drawImage(this.spritesUser.get('user90') || this.imageUser, box.x * this.widthTiles, box.y * this.heightTiles, this.imageUser.width, this.imageUser.height);
            }
        } catch (err) {
            console.error(err);
        }
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
            console.log("EL OBJETO ES", newBox)
            if (newBox.type === 'user') {
                console.log("entra")
                // this.drawImg(newBox);
                this.drawBox(newBox);
                this.context.drawImage(this.stairImage, 320, 150);
            } else {
                console.log("entra como no user")
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

        // console.log("Los points", points);

        if (points.length < 2 || points.some(val => val === undefined)) {
            return null;
        }

        // init algoritm
        let [f, s] = points;
        // update neighbors
        // this.stage.forEach(col => col.forEach(row => row.addNeighbors(this.stage)));
        // this.stage.forEach(col => col.forEach(row => console.log({...row})));

        // console.log("STAGE antes de entrar al algoritmo: ", this.stage);

        if (f.type === 'user')
            // console.log("Start:", f,   "Goal: ", s);
            return await this.astart(f, s);
        else
            // console.log("Start:", s,   "Goal: ", f);
            return await this.astart(s, f);
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
    }

    animateGoal(x: number, y: number) {

        let positionX = x-10;
        let positionY = y-13;

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

        this.animation = setInterval(() => {
            if (index >= path.length -1) {
                clearInterval(this.animation);
                let x = path[path.length-1].x * this.widthTiles;
                let y: number;
                if (path[0].y - path[path.length-1].y >= 0) {
                    y = path[path.length-1].y * this.heightTiles - this.heightTiles;
                } else {
                    y = path[path.length-1].y * this.heightTiles + (this.heightTiles*6);
                }
                this.animateGoal(x, y)
                setTimeout(() => {
                    ctx.clearRect(
                        x-15, y-38,
                        this.imageLocation.width * 2.6,
                        this.imageLocation.height * 1.9
                    );
                    index = 0;
                    this.drawLines(path, 'white', 5);
                    this.context.drawImage(this.stairImage, 320, 150);
                    this.walkingThePathWithLines(path);
                },700);

            } else {
                index++;
            }

            ctx.beginPath();
            ctx.moveTo(path[index - 1]?.x * this.widthTiles + center, path[index - 1]?.y * this.heightTiles + center);
            ctx.lineTo(path[index].x * this.widthTiles + center, path[index].y * this.heightTiles + center);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.closePath();
        }, 1000 / 10);
    }

    walkingThePathWithSprite(path: Box[]) {
        let p = 0;
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw guide lines
        this.animation = setInterval(() => {
            this.drawLines(path, '#1E9AFA', 1);
            let ctx = this.context;
            if (p >= path.length - 1) {
                ctx.beginPath();
                ctx.clearRect(path[path.length - 1]?.x * this.widthTiles - this.c, path[path.length - 1]?.y * this.heightTiles - this.c, this.imageUser.width, this.imageUser.height)
                ctx.fillStyle = path[p].type === 'ground' ? 'green' : path[p].color;
                ctx.fillRect(path[path.length - 1].x * this.widthTiles, path[path.length - 1].y * this.heightTiles, this.heightTiles, this.heightTiles)
                ctx.closePath();
                p = 0;  // repite animacion
            } else {
                p++;
            }
            // ctx.clearRect(path[p - 1]?.x * this.widthTiles, path[p - 1]?.y * this.heightTiles, this.heightTiles, this.heightTiles)
            ctx.clearRect(path[p - 1]?.x * this.widthTiles - this.c, path[p - 1]?.y * this.heightTiles - this.c, this.imageUser.width, this.imageUser.height)
            ctx.beginPath();
            ctx.fillStyle = path[p].type === 'ground' ? 'green' : path[p].color;

            let resX = path[p].x - path[p - 1]?.x;
            let resY = path[p].y - path[p - 1]?.y;

            let imgName = this.changeSprite(resX, resY);

            // ctx.fillRect(path[p].x * this.widthTiles, path[p].y * this.heightTiles, this.heightTiles, this.heightTiles)
            ctx.drawImage(this.spritesUser.get(imgName) || this.imageUser, path[p].x * this.widthTiles - this.c, path[p].y * this.heightTiles - this.c, this.imageUser.width, this.imageUser.height)
            if (path[p - 2]) {
                this.drawLines([path[p - 2], path[p - 1], path[p]], '#1E9AFA', 1)
            }
            ctx.closePath();
        }, 1000 / 5);
    }

    animateLocation(goal: Box) {

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

    reconstructPath(cameFrom: Map<Box, Box>, current: Box): Box[] {
        const total_path = [current];

        while (cameFrom.has(current)) {
            current = <Box>cameFrom.get(current);
            total_path.unshift(current);
        }

        return total_path;
    }

    async astart(start: Box, goal: Box): Promise<Box[] | null> {
        const openSet = [start];
        const cameFrom = new Map<Box, Box>();
        const gScore = new Map<Box, number>();
        const fScore = new Map<Box, number>(); // f(n) = g(n) + h(n)

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(start, goal));

        while (openSet.length > 0) { // while open set its not empty
            const current = this.getBoxWithLowestFScore(openSet, fScore);

            if (current === goal) {
                // console.log("encontrado");
                return this.reconstructPath(cameFrom, current);
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