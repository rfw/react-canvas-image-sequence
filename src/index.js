/**
 * CanvasImageSequence
 * github: https://github.com/rfw/eact-canvas-image-sequence
 * date: 2021-10-15
 */
import PropTypes from 'prop-types'
import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'

const CanvasImageSequence = (
  {
    data = [],
    fps = 60,
    canvasWidth = 200,
    canvasHeight = 200,
    autoPlay = false,
    loop = false,
    forward = false,
    onChange = null
  },
  ref
) => {
  const canvasRef = useRef(null)
  const [imgUrls, setImgUrls] = useState([])
  let [isForward, setIsForward] = useState(false)
  let [current, setCurrent] = useState(0)
  let [isFirst, setIsFirst] = useState(true)
  let [paused, setPaused] = useState(true)
  let [timer, setTimer] = useState(null)
  // let isForward = false
  // let current = 0
  // let isFirst = true
  // let paused = true

  useImperativeHandle(ref, () => ({
    play: () => {
      if (paused) {
        // 如果播放结束，重新播放需要重置关键帧
        if (current >= data.length - 1) {
          current = 0
          setCurrent(0)
        }
        autoPlay = true
        animation()
      }
    },
    pause: () => {
      if (!paused) {
        clearLoop()
      }
    },
    stop: () => {
      setIsForward(false)
      current = 0
      setCurrent(0)
      // const defaultAutoPlay = autoPlay
      autoPlay = false
      clearLoop()
      animation()
      // autoPlay = defaultAutoPlay
    },
    setCurrent: (index) => {
      autoPlay = false
      current = index
      setCurrent(index)
      if (!paused) {
        clearLoop()
      }
      animation()
    }
  }))

  const loadImages = (list) => {
    if (!Array.isArray(list)) {
      throw new Error('Parameter list is not an array')
    }
    if (list.length === 0) return
    const all = []
    list.forEach((v) => {
      const img = new Image()
      img.onload = function () {
        all.push(img)
        if (all.length === list.length) {
          setImgUrls(all)
        }
      }
      img.src = v
    })
  }

  const animation = () => {
    if (imgUrls.length === 0 || !imgUrls[current]) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(imgUrls[current], 0, 0, canvas.width, canvas.height)
    onChange && onChange(current, paused)
    if (!autoPlay) return
    if (current >= imgUrls.length - 1) {
      if (forward) {
        isForward = true
        setIsForward(true)
      } else if (!loop) {
        return clearLoop()
      } else {
        current = 0
        setCurrent(0)
      }
    } else if (current <= 0) {
      if (!loop && !isFirst) {
        return clearLoop()
      }
      isForward = false
      setIsForward(false)
    }

    if (isForward) {
      current--
    } else {
      current++
    }
    setCurrent(current)
    isFirst = false

    paused = false
    setPaused(false)

    setIsFirst(false)
    timer = setTimeout(animation, 1000 / fps)
    setTimer(timer)
  }

  const clearLoop = () => {
    timer && clearTimeout(timer)
    isFirst = true
    setIsFirst(true)
    paused = true
    setPaused(true)
    onChange && onChange(current, paused)
  }

  useEffect(() => {
    if (imgUrls.length !== 0) {
      clearLoop()
      animation()
    }
    return () => clearLoop()
  }, [imgUrls])

  useEffect(() => {
    loadImages(data)
  }, [data])

  return (
    <canvas
      ref={canvasRef}
      id='canvas-image-sequence'
      width={canvasWidth}
      height={canvasHeight}
    />
  )
}

CanvasImageSequence.propTypes = {
  data: PropTypes.array.isRequired
}

export default forwardRef(CanvasImageSequence)
