const image = [".jpeg", ".png", ".jpg", ".gif"];
const audio = [
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
  ".opus"
];

const other = [".txt", ".doc", ".md", ".markdown"];

const all = [...image, ...audio, ...other];

export type ExtensionType = "image" | "audio";

export const isExtensionValid = (
  ext: string,
  type?: ExtensionType
): boolean => {
  if (type) {
    switch (type) {
      case "audio":
        return audio.includes(ext);

      case "image":
        return image.includes(ext);

      default:
        return false;
    }
  }

  return all.includes(ext);
};

export const extensions = {
  image,
  audio,
  all
};
