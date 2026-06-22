/// <reference types="vite/client" />

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          alt?: string
          scale?: string
          exposure?: string
          'camera-orbit'?: string
          'camera-controls'?: boolean
          'auto-rotate'?: boolean
          'rotation-per-second'?: string
          'interaction-prompt'?: string
          'shadow-intensity'?: string | number
          'touch-action'?: string
        },
        HTMLElement
      >
    }
  }
}
