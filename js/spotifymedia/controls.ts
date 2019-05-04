import dragMock from "drag-mock";

export default class WebampControls {
  constructor() {}

  /* 
    Workaround: In order to remove all tracks from the playlist and play a new track, 
     we need to mock a drag drop event in the main window
  */
  static clearPlaylistAndLoadFile(fileId: string) {
    dragMock
      .dragStart(document.querySelector(`#file-${fileId}`))
      .drop(document.querySelector("#main-window"));
  }
}
