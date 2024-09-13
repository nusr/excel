import * as ComLink from 'comlink'
import method from './canvas/worker'

ComLink.expose(method)

