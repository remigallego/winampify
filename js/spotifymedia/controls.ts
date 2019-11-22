import dragMock from "drag-mock";

export default class WebampControls {
  /*
    Workaround: In order to remove all tracks from the playlist and play a new track,
     we need to mock a drag drop event in the main window
  */
  static mockWindowDrop() {
    dragMock.drop(document.querySelector("#main-window"));
  }
}
