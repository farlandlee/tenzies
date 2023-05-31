import powerbow from './powerbow.png';
export default function ToggleSwitch({toggleHandler,powerBowMode}) {

    return (
        <>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    className="toggle-switch-checkbox"
                    name="toggleSwitch"
                    id="toggleSwitch"
                    onChange={toggleHandler}
                    checked={powerBowMode}
                />
                <label className="toggle-switch-label" htmlFor="toggleSwitch">
                    <span className="toggle-switch-inner" />
                    <span className="toggle-switch-switch" />
                </label>
            </div>
            <img src={powerbow} alt="powerBow" height={40}/>
        </>
    )
}
