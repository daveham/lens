export interface ISourceDescriptor {
  id: string;
  name: string;
  file: string;
}

export interface IThumbnailDescriptor {
  id: string;
  file: string;
}

export interface IImageDescriptorLocation {
  x: number;
  y: number;
}

export interface IImageDescriptorSize {
  width: number;
  height: number;
}

export interface IImageDescriptorInput {
  location: IImageDescriptorLocation;
  id: string;
  group: string;
  size: IImageDescriptorSize;
}

export interface IImageDescriptorOutput {
  purpose: string;
}

export interface IImageDescriptor {
  input: IImageDescriptorInput;
  output: IImageDescriptorOutput;
}

export interface IStatsDescriptor {
  analysis: string;
  imageDescriptor: IImageDescriptor;
}
