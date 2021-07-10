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
  others: [
    ".txt",
    ".doc",
    ".md",
    ".markdown"
  ],
  all: []
};

export const isExtValid = (ext: string) => extensions.all.includes(ext);

export const isImageExt = (ext: string) => extensions.images.includes(ext);
export const isAudioExt = (ext: string) => extensions.audios.includes(ext);

extensions.all = [...extensions.images, ...extensions.audios, ...extensions.others];
