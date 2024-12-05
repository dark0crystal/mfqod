
import Image from "next/image";
import { Suspense } from "react";
export default async function Home() {
 
  return (
    <div>
     

      <Suspense fallback={<p>Loading feed...</p>}>
  
        <div>
        {/* <Image alt="image" width={500} height={500} src="https://ggrrwpwyqbblxoxidpmn.supabase.co/storage/v1/object/public/mfqodFiles/images"/> */}

        </div>
      </Suspense>
      main page

    </div>
  );
}
