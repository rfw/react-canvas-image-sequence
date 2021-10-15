import React, { useRef,useEffect, useState } from 'react'

import CanvasImageSequence from 'react-canvas-image-sequence'


const imgs = [];
for (let i = 21; i<=39; i++) {
  i = String(i).padStart(4, '0')
  imgs.push(require('./images/1_'+ i +'.png'))
}

const App = () => {

  const canvasRef = useRef(null);
  let [ current, setCurrent ] = useState(0)
  let [ paused, setPaused ] = useState(true)

  useEffect(() => {
    window.addEventListener('scroll' , function() {
      const h = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollCurrent = parseInt( h / 30);
      if (scrollCurrent > 0 && scrollCurrent <= 30) {
        canvasRef.current.setCurrent(scrollCurrent);
      }
    })
  }, [])

  const change = (index, paused) => {
    console.log('onChange index:', index, 'paused: ' ,paused)
    setCurrent(index)
    setPaused(paused)
  }

  const setPause = () => {
    if (paused) {
      canvasRef.current.play();
    } else {
      canvasRef.current.pause();
    }
  }

  const setStop = () => {
    canvasRef.current.stop();
  }

  const setCurrentFc = () => {
    setCurrent(current++)
    canvasRef.current.setCurrent(current);
  }

  return (
    <div style={{ height: 2000, padding: 30 }}>
      <div style={{ position: 'fixed'}}>
        <CanvasImageSequence
          ref={canvasRef}
          data={imgs}
          autoPlay={true}
          loop={true}
          forward={true }
          fps={10}
          canvasHeight={300}
          canvasWidth={300}
          onChange={change}
        />

        <button onClick={setPause}> { paused ? '播放' : '暂停'} </button>
        <button onClick={setStop}>停止</button>
        <button onClick={setCurrentFc}>关键帧+1</button>

        <br/>
        <p>
          滚动页面也可以
        </p>

      </div>

    </div>
  )
}

export default App
