import React, {useState, useEffect, useCallback} from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import ConfettiExplosion from 'react-confetti-explosion';

import './App.css';

export default function App() {

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(0)
    const [stopwatch, setStopwatch] = useState(0)
    const [best, setBest] = useState(() => JSON.parse(localStorage.getItem('stats')) || {time: 0, rolls: 0})
    const [startGame, setStartGame] = useState(false)

    function start() {
        setStartGame(true)
        setDice(allNewDice())
        setRolls(1)
    }

    const storeStats = useCallback(() => {
        const oldStats = JSON.parse(localStorage.getItem("stats"));
        let stats
        if(!oldStats || (oldStats.time > stopwatch && oldStats.rolls > rolls)) {
            stats = {
                time: stopwatch,
                rolls: rolls
            }
        }
        else if(oldStats.time > stopwatch) {
            stats = {
                ...oldStats,
                time: stopwatch
            }
        }
        else if(oldStats.rolls > rolls) {
            stats = {
                ...oldStats,
                rolls: rolls
            }
        }
        else {
            return
        }
        setBest(stats)
        localStorage.setItem('stats', JSON.stringify(stats))
    }, [rolls, stopwatch]);
    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    useEffect(() => {
        const timer = setInterval(() => {
            if(startGame) {
                setStopwatch(v => {
                    if(tenzies) {
                        clearInterval(timer)
                        storeStats()
                        return v
                    }
                    return v + 0.01
                })
            }
        }, 10);   
        return () => clearInterval(timer)
    }, [startGame,tenzies,storeStats])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRolls(oldRolls => oldRolls + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setStopwatch(0)
            setRolls(1)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <>
            <main>
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <div className="stats-container">
                    <div className="label">Rolls: </div>
                    <div className="rolls-counter">{rolls}</div>
                    <div className="label">Time:</div>
                    <div className="stopwatch">{stopwatch.toFixed(2)}</div>
                </div>
                {tenzies && <ConfettiExplosion />}
                <div className="stats-container">
                    <div className="label">Best Rolls: </div>
                    <div className="rolls-counter">{best.rolls}</div>
                    <div className="label">Best Time:</div>
                    <div className="stopwatch">{best.time.toFixed(2)}</div>
                </div>
                {!startGame ? 
                    <button
                    className="start-game"
                        onClick={start} 
                    >
                        Start Game
                    </button>
                :
                    <button 
                        className="roll-dice" 
                        onClick={rollDice}
                    >
                        {tenzies ? "New Game" : "Roll"}
                    </button>
                }
            </main>
            <footer className="footer">
                <div class="dragon-face">
                    <div class="left-horn"></div>
                    <div class="right-horn"></div>
                    <div class="left-eye">
                        <div class="pupil"></div>
                    </div>
                    <div class="right-eye">
                        <div class="pupil"></div>
                    </div>
                    <div class="nostrils"></div>
                    <div class="mouth"></div>
                </div>
            </footer>
        </>
    )
}
