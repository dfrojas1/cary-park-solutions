import { Composition } from 'remotion';
import { NerveMap } from './NerveMap';

export const RemotionRoot = () => (
  <Composition
    id="NerveMap"
    component={NerveMap}
    durationInFrames={240}
    fps={30}
    width={960}
    height={1080}
  />
);
