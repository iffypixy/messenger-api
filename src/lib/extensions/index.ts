export type ImageExtension = ".jpeg" | ".png" | ".jpg" | ".gif";
export type AudioExtension =
  | ".aac"
  | ".wav"
  | ".mp3"
  | ".mp4"
  | ".wma"
  | ".flac"
  | ".webm"
  | ".weba";

export type FileExtension = ImageExtension | AudioExtension;

interface Extensions {
  image: ImageExtension[];
  audio: AudioExtension[];
  all: (ImageExtension | AudioExtension)[];
}

const image: ImageExtension[] = [".jpeg", ".png", ".jpg", ".gif"];
const audio: AudioExtension[] = [
  ".aac",
  ".wav",
  ".mp3",
  ".mp4",
  ".wma",
  ".flac",
  ".webm",
  ".weba"
];

export const extensions: Extensions = {
  image,
  audio,
  all: [...image, ...audio]
};
