import dragMock from "drag-mock";

export function mockWindowDrop() {
  dragMock.drop(document.querySelector("#main-window"));
}

export function mockPlaylistDrop() {
    dragMock.drop(document.querySelector("#playlist-window"));
  }
