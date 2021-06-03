export type ExtensionType = "image" | "audio" | "text";

export const extensions = {
  images: [
    ".jpeg",
    ".png",
    ".jpg",
    ".gif"
  ],
  audios: [
    ".aac",
    ".wav",
    ".mp3",
    ".mp4",
    ".wma",
    ".flac",
    ".webm",
    ".weba",
    ".ogg",
    ".ogv",
    ".oga",
    ".ogx",
    ".ogm",
    ".spx",
    ".opus",
    ".mpga"
  ],
  text: [
    ".txt",
    ".doc",
    ".md",
    ".markdown"
  ],
  all: []
};

extensions.all = [...extensions.images, ...extensions.audios, ...extensions.text];

export const maxFileSize = 20000000;

export const isExtensionValid = (ext: string, type?: ExtensionType) => {
  if (type) {
    switch (type) {
      case "audio":
        return extensions.audios.includes(ext);

      case "image":
        return extensions.images.includes(ext);

      default:
        return false;
    }
  }

  return extensions.all.includes(ext);
}