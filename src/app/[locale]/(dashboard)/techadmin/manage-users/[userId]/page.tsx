import EditUserRole from "../../../_components/EditUserRole";
import UserBranchAssignment from "../../../_components/UserBranchAssignment";

export default async function TechadminEditUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <div className="w-full lg:w-[80%]">
      <EditUserRole userId={userId} />
      <UserBranchAssignment userId={userId} />
    </div>
  );
}
