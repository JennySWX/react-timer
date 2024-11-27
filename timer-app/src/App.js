import { useEffect, useState } from "react";
import "./style.css";

export default function App() {
  const [time, setTime] = useState({ hr: 0, min: 0, sec: 0 });
  const [isRunning, setRunning] = useState(false);
  const [isPause, setPause] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  /**
   * Note:
   * - setInterval: build in JS function to execute a function at regulat interval
   * - clearInterval: to stop the setInterval.
   */

  useEffect(() => {
    if (isRunning) {
      /**
       * Why need id:
       *
       * id here is used for the clearInterval, clearInterval is for
       * stop the auto time increasement every second.
       */
      console.log(time);
      const id = setInterval(() => {
        updateTime();
      }, 1000);

      setIntervalId(id);
    } else {
      if (isPause) {
        /** we need to cleat the interval here but not in the pauseTimer
         * function becuase in the pauseTimer function after we setPause
         * the change won't directly reflected on the isPause state:
         *
         * State updates in React are asynchronous:
         * When you call setRunning(!isRunning), React doesn't
         * immediately change the value of isRunning.
         * The change will be applied after the function completes
         * and React re-renders the component.
         *
         * Therefore we need to use useEffect to detect the change
         * of isRunning
         */
        clearInterval(intervalId);
      } else {
        clearTimer();
      }
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const updateTime = () => {
    setTime((prevTime) => {
      let { hr, min, sec } = prevTime;
      sec += 1;
      if (sec === 60) {
        sec = 0;
        min += 1;
      }

      if (min === 60) {
        min = 0;
        hr += 1;
      }
      return { hr, min, sec };
    });
  };

  useEffect(() => {
    if (isRunning) {
    }
  });

  const startTimer = () => {
    setRunning(true);
    setPause(false);
  };

  /**
   * When clear the timer, we need do
   * 1. change the is running to false
   * 2. stop the setInterval using clearInterval
   * 3. set the time to zero
   * 4. set the intervalId to null
   */
  const clearTimer = () => {
    setRunning(false);
    setPause(false);
    clearInterval(intervalId); // To stop the setInterval
    setTime({ hr: 0, min: 0, sec: 0 });
    // clear the intervalId
    setIntervalId(null);
  };

  const pauseTimer = () => {
    setRunning(!isRunning);
    setPause(!isPause);
  };

  const timeFormat = (timeDigit) => {
    return String(timeDigit).padStart(2, "0");
  };

  return (
    <div className="timerContainer">
      <div className="content">
        <span>
          {timeFormat(time.hr)} : {timeFormat(time.min)} :{" "}
          {timeFormat(time.sec)}
        </span>
      </div>

      <div className="buttons">
        <button onClick={startTimer}>Start</button>
        <button onClick={pauseTimer}>Pause</button>
        <button onClick={clearTimer}>Clear</button>
      </div>
    </div>
  );
}
