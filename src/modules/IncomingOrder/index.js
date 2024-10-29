var IncomingOrder = ""

const setRef = (ref) => {
    IncomingOrder = ref
}

const getRef = (data) => {
    IncomingOrder.onShowAlert(data)
}

const hideRef = () => {
    IncomingOrder.onTouchOutside(false)
}

const isVisible=()=> IncomingOrder.isVisible()
export default {
    setRef,
    getRef,
    hideRef,
    isVisible
}