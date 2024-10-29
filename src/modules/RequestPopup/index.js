var RequestPopup = ""

const setRef = (ref) => {
    RequestPopup = ref
}

const getRef = (data) => {
    // console.log("RequestPopup SHOW")
    RequestPopup.onShowAlert(data)
}

const hideRef= (data) => {
    RequestPopup.onHidePop(false)
}

const isVisible=()=> RequestPopup.isVisible()

export default {
    setRef,
    getRef,
    hideRef,
    isVisible
}