import Link from "next/link";
import { auth } from "../../../../auth";

export default async function NavBar() {
  const session = await auth();
  if (!session) return null;

  return (
    <div>
      <Link href={{
        pathname: "/dashboard/posts",
        query: { id: `${session.user?.id}` }, // Pass user id in query
      }}>
        Posts
      </Link>
      <Link href="/dashboard/claims">Claims</Link>
    </div>
  );
}
