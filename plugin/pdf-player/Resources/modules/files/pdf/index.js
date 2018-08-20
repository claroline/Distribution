import {PdfPlayer} from '#/plugin/pdf-player/files/pdf/components/player'

/**
 * Pdf resource application.
 *
 * @constructor
 */
export const App = () => ({
  styles: 'claroline-distribution-plugin-pdf-player-pdf-resource',
  components: {
    player: PdfPlayer
  }
})
