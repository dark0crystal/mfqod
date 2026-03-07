import BranchDetail from "../../../_components/BranchDetail";

type Props = { params: Promise<{ branchId: string }> };

export default async function TechadminBranchDetailPage({ params }: Props) {
  const { branchId } = await params;
  return <BranchDetail branchId={branchId} />;
}
