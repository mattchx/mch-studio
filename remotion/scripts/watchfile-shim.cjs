const fs = require("node:fs");
const { EventEmitter } = require("node:events");

const POLL_INTERVAL = 1000;

fs.watch = (filename, options, listener) => {
  const watcher = new EventEmitter();
  const watchOptions =
    options && typeof options === "object" ? options : { persistent: true };
  const callback = typeof options === "function" ? options : listener;

  const onChange = (curr, prev) => {
    if (curr.mtimeMs === prev.mtimeMs && curr.size === prev.size) {
      return;
    }

    if (callback) {
      callback("change", filename);
    }

    watcher.emit("change", "change", filename);
  };

  fs.watchFile(
    filename,
    {
      interval: POLL_INTERVAL,
      persistent: watchOptions.persistent ?? true,
    },
    onChange,
  );

  watcher.close = () => fs.unwatchFile(filename, onChange);
  watcher.ref = () => watcher;
  watcher.unref = () => watcher;

  return watcher;
};
