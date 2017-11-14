import IO from './lib/IO'
import Listenable from './Listenable'
import game from './Game'

let nextHowToShown = false

export default class TextOverlay extends Listenable() {
    constructor() {
        super()

        this.node = document.createElement('div');
        this.node.classList.add('text-overlay');
        this.node.innerHTML = '{{placeholder}}'

        this.nextKeys = [IO.SPACE, IO.ESC, IO.ENTER]
    }

    setText(text) {
        this.node.innerHTML = text + '<p class="right"><button>&raquo;</button></p>'

        if (! nextHowToShown) {
            nextHowToShown = true;
            this.node.innerHTML = this.node.innerHTML + '<p class="right"><small>Press <strong>esc</strong>, <strong>space</strong>, or <strong>enter</strong> to continue</small></p>'
        }
    }

    show() {
        document.body.appendChild(this.node);

        let onHide = () => {
            game.io.off(this.nextKeys, onHide)
            this.hide()
        }

        game.io.on(this.nextKeys, onHide);

        this.node.querySelector('button')
            .addEventListener('click', onHide);

        return this;
    }

    hide() {
        this.node.classList.add('hidden');
        this.emit('hide');
        setTimeout(() => {
            this.node.parentNode.removeChild(this.node);
        }, 500)
    }

    static display(text) {
        let overlay = new TextOverlay()
        overlay.setText(text)

        return overlay.show()
    }
}
