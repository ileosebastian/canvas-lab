
type KindOption = 'top-left-corner' |
    'top' |
    'top-right-corner' |
    'left' |
    'body' |
    'right' |
    'bottom-left-corner' |
    'bottom' |
    'bottom-right-corner';

interface Matrix {
    columns: number
    rows: number
}

export type BoxType = 'user' | 'place' | 'ground' | 'wall' | 'door';

export const GROUND_BOX = ['user', 'place', 'ground'];
export const OBSTACLE_BOX = ['wall', 'door'];

export class Box {
    x!: number;
    y!: number;
    color!: string;
    type!: BoxType;
    kindOption!: KindOption;
    neighbors!: Array<Box>;

    COLOR_BY_TYPE = {
        'user': 'green',
        'place': 'red',
        'ground': 'white',
        'wall': 'black',
        'door': '#6F4E37', // brown
    }

    constructor(x: number, y: number, type: BoxType, matrix: Matrix) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = this.COLOR_BY_TYPE[type];;
        this.neighbors = [];
        
        let {columns, rows} = matrix;
        if (columns && rows) {
            this.kindOption = x === 0 && y === 0 ? 'top-left-corner' :
                x > 0 && x < columns - 1 && y === 0 ? 'top' :
                    x === columns - 1 && y === 0 ? 'top-right-corner' :
                        x === 0 && y > 0 && y < rows - 1 ? 'left' :
                            x === columns - 1 && y > 0 && y < rows - 1 ? 'right' :
                                x === 0 && y === rows - 1 ? 'bottom-left-corner' :
                                    x > 0 && x < columns - 1 && y === rows - 1 ? 'bottom' :
                                        x === columns - 1 && y === rows - 1 ? 'bottom-right-corner' : 'body';
        } 
    }

    addNeighbors(stage: Array<Array<Box>>) {
        const COOR_OPTIONS = {
            'top-left-corner': [ // x = 0, y = 0
                { x: this.x, y: this.y + 1 }, // abajo
                { x: this.x + 1, y: this.y }, // derecha 
                { x: this.x + 1, y: this.y+1 }, // esquina inferior derecha
            ],
            'top': [
                { x: this.x - 1, y: this.y }, // izquierda
                { x: this.x + 1, y: this.y }, // derecha
                { x: this.x, y: this.y + 1 }, // abajo
            ],
            'top-right-corner': [ // x = columns-1, y = 0
                { x: this.x, y: this.y + 1 }, // abajo
                { x: this.x - 1, y: this.y }, // izquierda
                { x: this.x - 1, y: this.y+1 }, // esquina inferior izquierda
            ],
            'left': [
                { x: this.x, y: this.y - 1 }, // arriba 
                { x: this.x, y: this.y + 1 }, // abajo
                { x: this.x + 1, y: this.y }, // derecha
            ],
            'body': [
                { x: this.x, y: this.y - 1 }, // arriba
                { x: this.x, y: this.y + 1 }, // abajo
                { x: this.x - 1, y: this.y }, // izquieda
                { x: this.x + 1, y: this.y }, // derecha
            ],
            'right': [
                { x: this.x, y: this.y - 1 }, // arriba
                { x: this.x, y: this.y + 1 }, // abajo
                { x: this.x - 1, y: this.y }, // izquierda
            ],
            'bottom-left-corner': [ // x = 0, y = rows-1
                { x: this.x, y: this.y - 1 }, // arriba
                { x: this.x + 1, y: this.y }, // derecha
                { x: this.x + 1, y: this.y - 1 }, // esquina superior derecha
            ],
            'bottom': [
                { x: this.x - 1, y: this.y }, // izquierda
                { x: this.x + 1, y: this.y }, // derecha
                { x: this.x, y: this.y - 1 }, // arriba
            ],
            'bottom-right-corner': [ // x = columns-1, y = rows-1
                { x: this.x, y: this.y - 1 }, // arriba
                { x: this.x - 1, y: this.y }, // izquierda
                { x: this.x - 1, y: this.y -1 }, // esquina superior izquierda 
            ],
        };

        this.neighbors = [];
        COOR_OPTIONS[this.kindOption].forEach(coor => this.neighbors.push(stage[coor.x][coor.y]));
    }
}

// export type GroundType = 'user' | 'place' | 'road';

// export class Ground extends Box {
//     contain!: GroundType;

//     constructor(x: number, y: number, matrix: Matrix, contain: GroundType = 'road') {
//         let color = contain === 'road' ? '#fff' : contain === 'user' ? 'green' : 'red';
//         super(x, y, color, matrix);
//         this.contain = contain;
//     }

// }

// export type ObstacleType = 'wall' | 'door';

// export class Obstacle extends Box {
//     type!: ObstacleType;

//     constructor(x: number, y: number, matrix: Matrix, type: ObstacleType) {
//         let color = type === 'wall' ? '#000' : '#6F4E37';
//         super(x, y, color, matrix);
//         this.type = type;
//     }
// }