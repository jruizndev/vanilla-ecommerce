/* Base component */
export default class Component {
    constructor(element) {
        if (typeof element === 'string') {
            this.element = document.querySelector(element)
        } else {
            this.element = element
        }
        this.init()
    }
}
