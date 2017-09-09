class IO {
    constructor () {
        this.up = false
        this.down = false
        this.left = false
        this.right = false

        this.bindings = {
            up: [38,90,87],
            down: [40,83],
            left: [37,65,81],
            right: [39,68]
        }

        this.bindEvents()

        this.listeners = [];
    }

    on(keys, callback) {
        this.listeners.push({
            keys,
            callback
        })
    }

    updateKeyState (keyCode, state) {
        for(let prop in this.bindings) {
            if(this.bindings[prop].includes(keyCode)) {
                this[prop] = state
                return
            }
        }

        if ( state && this.listeners.length ) {
            this.listeners = this.listeners.filter((listener) => {
                // console.log(listener, listener.keys.includes(keyCode))
                if ( listener.keys.includes(keyCode) ) {
                    setTimeout(listener.callback, 1)
                    return false
                }

                return true;
            })
        }
    }

    bindEvents() {
        onkeydown = (e) => this.updateKeyState(e.keyCode, true)
        onkeyup = (e) => this.updateKeyState(e.keyCode, false)
        onblur = (e) => this.up = this.down = this.left = this.right = false
    }
}

IO.SPACE = 32
IO.ESC = 27
IO.ENTER = 13

export default IO
