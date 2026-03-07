import PostDetails from "../../../_components/PostDetails";

export default async function VerifiedPostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostDetails postId={postId} />;
}
