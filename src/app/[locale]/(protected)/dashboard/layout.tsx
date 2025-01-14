import NavBar from "./NavBar";
import { auth } from "../../../../../auth";
import img2 from "../../../../../public/img2.jpeg"
import UserInfo from "./UserInfo";
export default async function Layout({children}: Readonly<{ children: React.ReactNode;}>)  {
    const session = await auth();
    if (!session) return null;
  return (
    <>

      <main>
      <div className="grid grid-cols-3 h-screen">
        <UserInfo/>
        <NavBar userId={session.user?.id}/>

        {children}
        </div>
      </main>

    </>
  )
}