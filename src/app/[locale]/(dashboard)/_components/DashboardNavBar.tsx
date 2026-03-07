import DashboardSidebar from "./DashboardSidebar";

type RoleResult = {
  role: string;
  managedPlace: string | null;
  managedOrg: string | null;
};

export default function DashboardNavBar({ result }: { result: RoleResult }) {
  return <DashboardSidebar result={result} />;
}
