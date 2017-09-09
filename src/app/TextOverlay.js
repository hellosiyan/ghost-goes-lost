import game from './Game'
import IO from './IO'

export default class TextOverlay {
    constructor() {
        this.node = document.createElement('div');
        this.node.classList.add('t-o');
        this.node.innerHTML = '{{placeholder}}'

        this.onNextCallback = () => {};
    }

    setText(text) {
        this.node.innerHTML = text
    }

    addNext(callback) {
        this.node.innerHTML = this.node.innerHTML + '<button>&raquo;</button>'
        this.onNextCallback = callback;

        let onNext = () => {
            this.hide();
            callback(this)
        }

        this.node.querySelector('button').addEventListener('click', onNext);
        game.io.on([IO.SPACE, IO.ESC, IO.ENTER], onNext);
    }

    show() {
        document.body.appendChild(this.node);
    }

    hide() {
        this.node.classList.add('hidden');
        setTimeout(() => {
            // this.node.parentNode.removeChild(this.node);
        }, 500)
    }

    static display(text) {
        let overlay = new TextOverlay()
        overlay.setText(text)
        overlay.show()

        return overlay
    }
}
