import Sync from './classes/sync'
import WebGL from './webGL.js'
import { interpolateRgb, interpolateBasis } from 'd3-interpolate'


let volumeMultipliers = {
    'beat': 1,
    'tatum': 1,
    'bar': 1,
    'section': 1,
    'segment': 1,
}

const naturalVolumeRange = 2; // Input arrives within (0, 2)
const scaledVolumeRange = 3; // Scaling range to (0, 10)


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

  scaleVolume(type = '') {
    const preprocessedVolume = Math.pow(this.sync.volume, volumeMultipliers[type])
    // (((oldVal - oldMin) * newRange) / oldRange) + newMin
    const scaledVolume = (preprocessedVolume * scaledVolumeRange) / naturalVolumeRange
    console.log('volume => old: ', this.sync.volume, 'preproc: ', preprocessedVolume, ', new: ', scaledVolume);
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
        const volume = this.scaleVolume('beat')
        this.webgl.autoSplat(volume, 'beat');
      }
    })

    this.sync.on('bar', beat => {
      if (this.webgl.getConfig().ON_BAR) {
        const volume = this.scaleVolume('bar')
        this.webgl.extraSplat(volume, 'bar');
      }
    })

    this.sync.on('tatum', beat => {
      if (this.webgl.getConfig().ON_TATUM) {
        const volume = this.scaleVolume('tatum')
        this.webgl.autoSplat(volume, 'tatum');
      }
      // send song update on every item
      this.webgl.updateSong(this.sync.state.currentlyPlaying);

    })

    this.sync.on('section', beat => {
      if (this.webgl.getConfig().ON_SECTION) {
        const volume = this.scaleVolume('section')
        this.webgl.autoSplat(volume, 'section');
      }
    })

    this.sync.on('segment', beat => {
      if (this.webgl.getConfig().ON_SEGMENT) {
        const volume = this.scaleVolume('segment')
        this.webgl.autoSplat(volume, 'segment');
      }      
    })

  }
}