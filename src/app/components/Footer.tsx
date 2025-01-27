import Brand from "./navbar/Brand"
import { Link } from "@/i18n/routing";
// components/Footer.js
export default function Footer() {
    return (
      <footer className=" text-gray-500 py-10 mt-20 border-t-2">
        <div className="flex flex-col lg:flex-row">
       

            {/* brand and lang change */}
            <div>
              <Brand/>
              <p className="text-sm text-gray-500">مفقود هو موقع لمساعدة الأشخاص للحصول على مفقوداتهم</p>
            </div>

            {/* Links */}
            <div>
              {/*  */}
              <div>
                <h1>روابط سريعة</h1>
                  <div>
                    <Link href="/">ابحث</Link>
                  </div>
                  <div>
                    <Link href="/">بلغ</Link>
                  </div>
                  <div>
                    <Link href="/">اي شي</Link>
                  </div>
              </div>
              {/*  */}
              <div>
                <h1>الخصوصية و البنود</h1>
                  <div>
                    <Link href="/"></Link>
                  </div>
                  <div>
                    <Link href="/"></Link>
                  </div>
                  <div>
                    <Link href="/"></Link>
                  </div>
              </div>
              {/*  */}
              <div>
                <h1>أشياء أخرى</h1>
                  <div>
                    <Link href="/">رابط</Link>
                  </div>
                  <div>
                    <Link href="/">رابط</Link>
                  </div>
                  <div>
                    <Link href="/">رابط</Link>
                  </div>
              </div>
            </div>
         
        </div>

      </footer>
    );
  }
