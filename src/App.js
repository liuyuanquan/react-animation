import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      play: false
    }
    this.progressBar1 = React.createRef()

    this.progressBar2 = React.createRef()

    this.progressBar3 = React.createRef()
    this.timeId3 = null

    this.progressBar4 = React.createRef()
    this.timeId4 = null

    this.progressCanvas = React.createRef()
    this.canvas = null
    this.ctx = null
    this.timeId5 = null

    this.progressSVG = React.createRef()
    this.svg = null

    this.startAnimation = this.startAnimation.bind(this)
  }
  componentDidMount() {
    const { progressCanvas, progressSVG } = this

    const canvas = progressCanvas.current
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height

    const svg = progressSVG.current
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', 0)
    rect.setAttribute('y', 0)
    rect.setAttribute('width', 0)
    rect.setAttribute('height', svg.getBoundingClientRect().height)
    rect.setAttribute('style', 'fill:red')

    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    animate.setAttribute('attributeName', 'width')
    animate.setAttribute('from', 0)
    animate.setAttribute('to', svg.getBoundingClientRect().width)
    animate.setAttribute('begin', '0ms')
    animate.setAttribute('dur', '1684ms')
    animate.setAttribute('repeatCount', 'indefinite')
    animate.setAttribute('calcMode', 'linear')
    rect.appendChild(animate)
    svg.appendChild(rect)
    svg.pauseAnimations()

    this.canvas = canvas
    this.svg = svg
    this.ctx = ctx
  }
  startAnimation() {
    let { play } = this.state
    const { progressBar1, progressBar2, progressBar3, progressBar4, canvas, ctx, svg } = this
    play = !play
    if (play) {
      progressBar1.current.style.width = '100%'

      progressBar2.current.style.animationPlayState = 'running'
      
      const changeWidth1 = () => {
        let currentWidth = progressBar3.current.style.width
        currentWidth = Number(currentWidth.replace('%', ''))
        if (currentWidth >= 100) {
          currentWidth = 0
        }
        progressBar3.current.style.width = (currentWidth + 1) + '%'
        this.timeId3 = setTimeout(changeWidth1, 1000 / 60)
      }
      changeWidth1()

      const changeWidth2 = () => {
        let currentWidth = progressBar4.current.style.width
        currentWidth = Number(currentWidth.replace('%', ''))
        if (currentWidth >= 100) {
          currentWidth = 0
        }
        progressBar4.current.style.width = (currentWidth + 1) + '%'
        this.timeId4 = requestAnimationFrame(changeWidth2)
      }
      changeWidth2()

      const ctxWidth = canvas.width
      const ctxHeight = canvas.height
      const drawHeight = ctxHeight
      ctx.fillStyle = 'red'
      const draw = () => {
        ctx.clearRect(0, 0, ctxWidth, ctxHeight)
        let percent = +canvas.dataset.progress || 0
        percent = ++percent > 100 ? 0 : percent
        const drawWidth = percent / 100 * ctxWidth
        canvas.setAttribute('data-progress', percent)
        ctx.fillRect(0, 0, drawWidth, drawHeight)
        this.timeId5 = setTimeout(draw, 1000 / 60)
      }
      draw()
      
      svg.unpauseAnimations()
    } else {
      progressBar2.current.style.animationPlayState = 'paused'
      clearTimeout(this.timeId3)
      cancelAnimationFrame(this.timeId4)
      clearTimeout(this.timeId5)

      svg.pauseAnimations()
    }
    this.setState({
      play: play
    })
  }
  render() {
    const { startAnimation, progressBar1, progressBar2, progressBar3, progressBar4, progressCanvas, progressSVG } = this
    const { play } = this.state
    return (
      <div className='wrapper'>
        <button onClick={startAnimation}>{ play ? '暂停' : '开始' }</button>
        <h3>transition</h3>
        <div className='progress-wrap'>
          <div className='progress-bar transition' ref={progressBar1}></div>
        </div>
        <h3>animation</h3>
        <div className='progress-wrap'>
          <div className='progress-bar animation' ref={progressBar2}></div>
        </div>
        <h3>setTimeout</h3>
        <div className='progress-wrap'>
          <div className='progress-bar' style={{width:'0%'}} ref={progressBar3}></div>
        </div>
        <h3>requestAnimationFrame</h3>
        <div className='progress-wrap'>
          <div className='progress-bar' style={{width:'0%'}} ref={progressBar4}></div>
        </div>
        <h3>canvas</h3>
        <div className='progress-wrap'>
          <canvas className='progress-canvas' ref={progressCanvas} data-progress='0'></canvas>
        </div>
        <h3>SVG</h3>
        <div className='progress-wrap'>
          <svg className='progress-svg' xmlns='http://www.w3.org/2000/svg' ref={progressSVG}>  
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
