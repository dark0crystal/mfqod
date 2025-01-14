import ReportFoundItem from "../../components/Forms/ReportFoundItem";
import {auth} from '../../../../auth'
import { redirect } from "next/navigation";

export default async function ReportItem() {
  const session = await auth();

const currentUrl = "report-found-item"
  if(session?.user == null){
    redirect(`/login?redirectit=${encodeURIComponent(currentUrl)}`);
  }
  return(
    <div>
      <ReportFoundItem/>
    </div>
  )
}