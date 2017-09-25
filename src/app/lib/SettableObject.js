export default class SettableObject {
    set(properties) {
        return Object.assign(this, properties)
    }
}
