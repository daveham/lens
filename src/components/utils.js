export function makeImgUrl(file) {
  if (process.env.NODE_ENV === 'production') {
    return `/lens/build/images/${file}`;
  }
  return `/build/images/${file}`;
}
