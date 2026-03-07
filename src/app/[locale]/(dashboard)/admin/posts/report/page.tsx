import ReportFoundItem from "@/app/components/Forms/ReportFoundItem";

export default function AdminReportFoundItemPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Report found item</h1>
      <ReportFoundItem successRedirect="/admin/posts" />
    </div>
  );
}
