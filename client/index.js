import { auth } from './classes/sync'
import Splatter from './splat'


if (window.location.hash === '#start') {
  const splatter = new Splatter()
} else {
  auth()
}
