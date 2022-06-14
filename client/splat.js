import Sync from './classes/sync'
import WebGL from './webGL.js'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'

const naturalVolumeRange = 2; // Input arrives within (0, 2)
const scaledVolumeRange = 3; // Scaling range to (0, 3)


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

  scaleVolume() {
    // consider preprocessing volume to create more volatility?
    // (((oldVal - oldMin) * newRange) / oldRange) + newMin
    const scaledVolume = (this.sync.volume * scaledVolumeRange) / naturalVolumeRange
    console.log('volume => old: ', this.sync.volume, ', new: ', scaledVolume);
    return scaledVolume;
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
      if (this.webgl.getConfig().ON_BEAT) {
        const volume = this.scaleVolume()
        this.webgl.autoSplat(volume, 'beat');
      }
    })

    this.sync.on('bar', beat => {
      if (this.webgl.getConfig().ON_BAR) {
        const volume = this.scaleVolume()
        this.webgl.extraSplat(volume, 'bar');
      }
    })

    this.sync.on('tatum', beat => {
      if (this.webgl.getConfig().ON_TATUM) {
        const volume = this.scaleVolume()
        this.webgl.autoSplat(volume, 'tatum');
      }
      // send song update on every item
      this.webgl.updateSong(this.sync.state.currentlyPlaying);

    })

    this.sync.on('section', beat => {
      if (this.webgl.getConfig().ON_SECTION) {
        const volume = this.scaleVolume()
        this.webgl.autoSplat(volume, 'section');
      }
    })

    this.sync.on('segment', beat => {
      if (this.webgl.getConfig().ON_SEGMENT) {
        const volume = this.scaleVolume()
        this.webgl.autoSplat(volume, 'segment');
      }      
    })

  }
}