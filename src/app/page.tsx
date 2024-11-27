import { auth } from "../../auth";
import { Suspense } from "react";
export default async function Home() {
  const session = await auth()
  if (!session?.user) return null
  return (
    <div>
     

      <Suspense fallback={<p>Loading feed...</p>}>
        <p>{session.user.email}</p>
      </Suspense>
      main page
    </div>
  );
}
