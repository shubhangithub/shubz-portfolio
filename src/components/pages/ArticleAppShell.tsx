import { ArticleV5 } from "./ArticleV5";
import { usePageState } from "../../lib/usePageState";

/** Essays retain SSR; their diagrams stay out of the notebook page bundle. */
export default function ArticleAppShell({ slug }: { slug: string }) {
 const props = usePageState();
 return <ArticleV5 slug={slug} {...props} />;
}
