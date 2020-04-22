import watch from 'gulp-watch';
import compile from './compile';
import { transpileScripts } from './config';

export default function dev() {
  watch(transpileScripts, () => compile(true));
}
