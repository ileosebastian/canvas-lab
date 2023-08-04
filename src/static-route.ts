import { Box } from "./boxes";

export const routeStatic = async (start: Box, goal: Box, columns: number, rows: number): Promise<Box[] | null> => {

    let middleCol = Math.floor(columns / 2);
    let middleRow = Math.floor(rows / 2);
    let route: Box[] = [];
    console.log("Mitad de columnas: ", middleCol, "mitad de filas:", middleRow);

    console.log("START: ", start, "GOAL:", goal)

    console.log("DEL START, con respecto al GOAL:")
    console.log("------------Y")

    // let tmp = start;
    // let temporalY = 0;
    // let temporalX = 0;
    // let neighbors: Box[] = [];
    // while (tmp.x !== goal.x && tmp.y !== goal.y) {
    //     if (tmp.y >= goal.y) {
    //         neighbors = tmp.neighbors.filter(n => n.y < tmp.y && (n.x >));
    //     } else {
    //         neighbors = tmp.neighbors.filter(n => n.y > tmp.y);
    //     }
    // }

    if (start.y >= goal.y) {
        console.log("esta hacia abajo o al centro");
        let tmp = start;
        route.push(tmp);
        while (tmp.y > goal.y) {
            let neighbor = tmp.neighbors.filter(n => (n.y < tmp.y && n.x === tmp.x) && n.neighbors.every(n => n.type !== 'wall'));
            
            tmp = neighbor.pop() || tmp;
            route.push(tmp);
            console.log("tengo que ir por aqui de subida", `[${tmp.x}, ${tmp.y}]`);
        }

        start = tmp;
    } else {
        console.log("esta hacia arriba");
        let tmp = start;
        route.push(tmp);
        while (tmp.y < goal.y) {
            let neighbor = tmp.neighbors.filter(n => (n.y > tmp.y && n.x === tmp.x) && n.neighbors.every(n => n.type !== 'wall'));
            
            tmp = neighbor.pop() || tmp;
            route.push(tmp);
            console.log("tengo que ir por aqui de subida", `[${tmp.x}, ${tmp.y}]`);
        }

        start = tmp;
    }

    console.log("------------X")
    if (start.x >= goal.x) {
        console.log("esta a la derecha o al centro");
        let tmp = start;
        route.push(tmp);
        while(tmp.x > goal.x) {
            let neighbor = tmp.neighbors.filter(n => (n.x < tmp.x && n.y === tmp.y) && n.neighbors.every(n => n.type !== 'wall'));

            // console.log("tengo que ir por aqui de subida", ...neighbor);

            tmp = neighbor.pop() || tmp;
            route.push(tmp);
            console.log("tengo que ir por aqui de subida", `[${tmp.x}, ${tmp.y}]`);
        }
    } else {
        console.log("esta a la izquierda");
        let tmp = start;
        route.push(tmp);
        while(tmp.x < goal.x) {
            let neighbor = tmp.neighbors.filter(n => (n.x > tmp.x && n.y === tmp.y) && n.neighbors.every(n => n.type !== 'wall'));

            // console.log("tengo que ir por aqui de subida", ...neighbor);

            tmp = neighbor.pop() || tmp;
            route.push(tmp);
            console.log("tengo que ir por aqui de subida", `[${tmp.x}, ${tmp.y}]`);
        } 
    }

    return route.length === 0 ? null : route;
};



// console.log("DEL GOAL, con respecto al START:")
//     if (goal.x >= start.x) {
//         console.log("esta a la derecha o al centro");
//     } else {
//         console.log("esta a la izquierda");
//     }

//     if (goal.y >= start.y) {
//         console.log("esta hacia abajo o al centro");
//     } else {
//         console.log("esta hacia arriba");
//     }vjk