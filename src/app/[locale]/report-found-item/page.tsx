import ReportFoundItem from "../../components/Forms/ReportFoundItem";
import {auth} from '../../../../auth'
import {redirect} from '@/i18n/routing';
import { getLocale } from "next-intl/server"; 

 


export default async function ReportItem() {
  const session = await auth();
  const locale = await getLocale();   

  if(!session){
    redirect({href: '/login', locale:`${locale}`});
  }




  return(
    <div>
      <ReportFoundItem/>
    </div>
  )
}