import { Link } from "@/i18n/routing";
import prisma from "@/lib/db";
import NavbarSlider from "./NavbarSlider";

export default async function NavBar(params : any) {

  const {userId} = params;
  if (!userId) return null;
  const result =await getUserRoleAndManagedPlaces(userId)


  return (
    <div>
     
      {/* For the CTO */}
      {result.role == "TECHADMIN" &&
          <div>
            <h1>Hello my CO-Founder & CTO </h1>
            <NavbarSlider userRole ={result.role} /> 
          </div>
      }
      {/* for admin  */}
      {result.role == "ADMIN" &&
          <div>
            <h1>Welcome Admin, Thank For Your Great Job </h1>
            <NavbarSlider userRole ={result.role} /> 
          </div>
      }
      {/* for verified */}
      {result.role == "VERIFIED" &&
          <div>
            <h1>Welcome { <h1> you are an admin in {result?.managedPlaces.map((manage ,index)=>(
          <div key={index}>
            <p>{manage.place}</p>
            <p>{manage.orgnization}</p>
          </div>
        ))}</h1>}, Thank For Your Great Job </h1>
        <NavbarSlider userRole ={result.role} /> 
          </div>
      }
       {/* for Basic */}
      {result.role == "BASIC" &&
          <div>
            <h1>Welcome Admin, Thank For Your Great Job </h1>
            <NavbarSlider userRole ={result.role} /> 
          </div>
      }

      <div>
       
        <h1> you are  {result?.role}</h1>
      </div>

      <div  >
        <Link 
        href={{
          pathname: "/dashboard/posts",
          query: { id: `${userId}` }, // Pass user id in query
        }}>
          <h1 className="bg-sky-400 rounded-3xl py-3 px-4 text-center">Show Posts</h1>
        </Link>
      </div>

      <div>

      </div>


    </div>
  );
}



export async function getUserRoleAndManagedPlaces(userId: string) {
  try {
    const userWithManage = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        role: true,
        manage: {
          select: {
            place: true,
            orgnization: true,
          },
        },
      },
    });

    if (!userWithManage) {
      throw new Error('User not found');
    }

    return {
      role: userWithManage.role,
      managedPlaces: userWithManage.manage,
    };
  } catch (error) {
    console.error('Error fetching user role and managed places:', error);
    throw error;
  }
}