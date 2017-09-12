import {Rect} from './Drawables'
import game from './Game'

export default class Player extends Rect {
    constructor() {
        super()

        this.direction = 'd'; // u d l r

        this.width = game.config.size.me
        this.drawHeight = this.width/11*19
        this.height = Math.round(this.drawHeight*0.1)
        this.x = game.config.size.grid
        this.y = game.config.size.grid

        this.style.color = '#f0f';
        this.loadImage()
    }

    loadImage() {
        this.img = new Image();
        this.img.addEventListener('load', () => this.imgLoaded = true, false);
        this.img.src = 'data:image/gif;base64,R0lGODlhHAATAMIHADMzM2M4IeZcRUTNmOu2fObbRf///wAAACH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAAcABMAAAOWeBfcoatBJ1UQFFvMIu1fKIoLYZoPhXrOopgAERNWI9cUdJw8fuItCAwwm/R2Kt3uKDTpeDTIYEqlKqqDA7Z63U6vpq/3u5wapk5t2FCupteFc3pgMhTa1DfBjI7S92xhblGCeX5chX0QAoyNAjqNi46MkJOPkpcHlpmajACRmJiflKKgCkSZjaOcRAAHrTqwp0SvtAcJADs=';
    }

    draw(ctx) {
        if (!this.imgLoaded) {
            return super.draw(ctx)
        }

        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        let r = this.width/19

        if (this.direction == 'd') {
            ctx.drawImage(this.img, 0,0,11,19,this.x, this.y-Math.round(this.drawHeight-this.height),this.width,this.drawHeight)
        } else if (this.direction == 'u') {
            ctx.drawImage(this.img, 17,0,11,19,this.x, this.y-Math.round(this.drawHeight-this.height),this.width,this.drawHeight)
        } else if (this.direction == 'r') {
            ctx.drawImage(this.img, 11,0,6,19,this.x+r*5, this.y-Math.round(this.drawHeight-this.height),this.width-r*5,this.drawHeight)
        } else if (this.direction == 'l') {
            ctx.scale(-1,1)
            ctx.drawImage(this.img, 11,0,6,19,-1*this.x-this.width+r*5, this.y-Math.round(this.drawHeight-this.height),this.width-r*5,this.drawHeight)
        }
    }

    move() {
        if (game.io.left) {
            this.x -= game.config.speed.move * game.loop.dt
            this.direction = 'l'
        } else if (game.io.right) {
            this.x += game.config.speed.move * game.loop.dt
            this.direction = 'r'
        }

        if (game.io.up) {
            this.y -= game.config.speed.move * game.loop.dt
            this.direction = 'u'
        } else if (game.io.down) {
            this.y += game.config.speed.move * game.loop.dt
            this.direction = 'd'
        }
    }
}
