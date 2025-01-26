"use client"
import { Link } from "@/i18n/routing";
import DataProvider from "@/app/storage";
import { useTranslations } from "next-intl";
export default function NavbarSlider({ userRole, managedOrg , managedPlace }: { userRole: string; managedOrg?: any ,managedPlace?: any }) {
const t= useTranslations("storage")
  const { orgNames } = DataProvider();
  const renderLinks = () => {
    switch (userRole) {
      case "TECHADMIN":
        // Full access to all org names
        return orgNames.map((org, index) => (
          <Link
            key={index}
            href={{
              pathname: "/dashboard/posts",
              query: { orgName: org.key}, // Pass orgName as a query
            }}
          >
            <div className="p-3 bg-blue-500 text-white rounded-lg my-1 cursor-pointer">
              {org.name}
            </div>
          </Link>
        ));
      case "ADMIN":
        // Full access to all places
        return orgNames.map((org, index) => (
          <Link
            key={index}
            href={{
              pathname: "/dashboard/posts",
              query: { orgName: org.key  }, // Pass orgName as a query
            }}
          >
            <div className="p-4 bg-green-500 text-white rounded-lg my-2 cursor-pointer">
              {org.name}
            </div>
          </Link>
        ));
      case "VERIFIED":
        // Access only to managed organizations
        return(
            <div>
          <Link
         
            href={{
              pathname: "/dashboard/posts",
              query: { orgName: managedOrg}, // Pass orgName as a query
            }}
          >
            <div className="p-4 bg-yellow-500 text-white rounded-lg my-2 cursor-pointer">
              {t(`org.${managedOrg}`)}
            </div>
          </Link>
           <Link
         
           href={{
             pathname: "/dashboard/posts",
             query: { orgName: managedOrg ,placeName:managedPlace}, // Pass orgName as a query
           }}
         >
           <div className="p-4 bg-yellow-500 text-white rounded-lg my-2 cursor-pointer">
             {t(`place.${managedPlace}`)}
           </div>
         </Link>
         </div>
        )

      case "BASIC":
        // Access only to their added places
        return (
            <div>
                <h1>You are a normal user</h1>
            </div>
        )
      default:
        return <p>No access available</p>;
    }
  };

  return <div className="flex flex-col space-y-2">{renderLinks()}</div>;
}
