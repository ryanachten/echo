declare interface HTMLCanvasElement {
  // Capture stream still a working draft hence not included in the HTML type spec
  // but it is well supported, so should be OK to use
  captureStream(frameRate?: number): MediaStream;
}
