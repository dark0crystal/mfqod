import NavBar from "./NavBar";
import { auth } from "../../../../../auth";
export default async function Layout({children}: Readonly<{ children: React.ReactNode;}>)  {
    const session = await auth();
    if (!session) return null;
  return (
    <>

      <main>
        <NavBar userId={session.user?.id}/>
        {children}
      </main>

    </>
  )
}