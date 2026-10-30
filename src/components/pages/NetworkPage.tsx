import { usePageState } from '../../lib/usePageState';
import { BuildsV6 } from './BuildsV6';
import { NotebookGraph } from '../explore/NotebookGraph';

// This entry alone imports the network synchronously, so its static response
// contains the actual SVG. The guide entry keeps the physics lazy-loaded.
export default function NetworkPage() {
  const props = usePageState();
  return <BuildsV6 {...props} initialView="graph" network={<NotebookGraph />} />;
}
