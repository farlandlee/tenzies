import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    
    let pips = []
    for(let i = 1; i<= props.value; i++) {
        pips.push(<div className={`pip pip-${i}`} key={`${props.id}-${i}`}></div>)
    }

    return (
        <div 
            className={`die-face pips-${props.value}`}
            style={styles}
            onClick={props.holdDice}
        >
            {pips}
        </div>
    )
}