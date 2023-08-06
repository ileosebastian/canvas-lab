// import { Box } from "./boxes";

// export const walkingThePathWithSprite = (
//     path: Box[],
//     c: number,
//     widthTiles: number, heightTiles: number,
//     context: CanvasRenderingContext2D, imageUser: HTMLCanvasElement, animation: any) => {
//     let p = 0;
//     // context.clearRect(0, 0, canvas.width, canvas.height);
//     // draw guide lines
//     animation = setInterval(() => {
//         drawLines(path, '#1E9AFA', 1);
//         let ctx = context;
//         if (p >= path.length - 1) {
//             ctx.beginPath();
//             ctx.clearRect(path[path.length - 1]?.x * widthTiles - c, path[path.length - 1]?.y * heightTiles - c, imageUser.width, imageUser.height)
//             ctx.fillStyle = path[p].type === 'ground' ? 'green' : path[p].color;
//             ctx.fillRect(path[path.length - 1].x * widthTiles, path[path.length - 1].y * heightTiles, heightTiles, heightTiles)
//             ctx.closePath();
//             p = 0;  // repite animacion
//         } else {
//             p++;
//         }
//         // ctx.clearRect(path[p - 1]?.x * widthTiles, path[p - 1]?.y * heightTiles, heightTiles, heightTiles)
//         ctx.clearRect(path[p - 1]?.x * widthTiles - c, path[p - 1]?.y * heightTiles - c, imageUser.width, imageUser.height)
//         ctx.beginPath();
//         ctx.fillStyle = path[p].type === 'ground' ? 'green' : path[p].color;

//         let resX = path[p].x - path[p - 1]?.x;
//         let resY = path[p].y - path[p - 1]?.y;

//         let imgName = changeSprite(resX, resY);

//         // ctx.fillRect(path[p].x * widthTiles, path[p].y * heightTiles, heightTiles, heightTiles)
//         ctx.drawImage(spritesUser.get(imgName) || imageUser, path[p].x * widthTiles - c, path[p].y * heightTiles - c, imageUser.width, imageUser.height)
//         if (path[p - 2]) {
//             drawLines([path[p - 2], path[p - 1], path[p]], '#1E9AFA', 1)
//         }
//         ctx.closePath();
//     }, 1000 / 5);
// };

    // drawImg(box: Box) {
    //     console.log("entra a funcion dibujar img")
    //     try {
    //         if (this.spritesUser.has('user0') && this.spritesUser.get('user0')) {
    //             this.context.drawImage(this.spritesUser.get('user90') || this.imageUser, box.x * this.widthTiles, box.y * this.heightTiles, this.imageUser.width, this.imageUser.height);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }