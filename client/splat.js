import Sync from './classes/sync'
import WebGL from './webGL.js'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'


export default class Splatter {
  constructor() {
    console.log('i am born')
    // now we are listening
    this.sync = new Sync(1) // pass in volume smoothing
    this.watch()
    this.hooks()

    this.webgl = new WebGL()
    this.webgl.run()
  }


  watch() {
    this.sync.watch('active', val => {
      if (val === true) {
        this.webgl.setActive();
      } else {
        this.webgl.removeTrackDiv();
      }
    })
  }

  hooks() {
    this.sync.on('beat', beat => {
      console.log(this.sync.volume);
      if (this.webgl.getConfig().ON_BEAT) {
        const volume = Math.pow(this.sync.volume, 1)
        this.webgl.autoSplat(volume);
      }
    })

    this.sync.on('bar', beat => {
      if (this.webgl.getConfig().ON_BAR) {
        this.webgl.extraSplat(this.sync.volume);
      }
    })

    this.sync.on('tatum', beat => {
      if (this.webgl.getConfig().ON_TATUM) {
        const volume = Math.pow(this.sync.volume, 2)
        this.webgl.autoSplat(volume);
      }
      // send song update on every item
      this.webgl.updateSong(this.sync.state.currentlyPlaying);

    })

    this.sync.on('section', beat => {
      if (this.webgl.getConfig().ON_SECTION) {
        this.webgl.autoSplat(this.sync.volume);
      }
    })

    this.sync.on('segment', beat => {
      if (this.webgl.getConfig().ON_SEGMENT) {
        this.webgl.autoSplat(this.sync.volume);
      }      
    })

  }
}