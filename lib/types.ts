export {}

declare global {
  interface Document {
    webkitExitFullscreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
    webkitFullscreenElement?: Element
    msFullscreenElement?: Element
  }

  interface HTMLElement {
    webkitRequestFullscreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
  }
}
