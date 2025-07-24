import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const courses = [
    'Foundations of Global Politics',
    'Theories of International Relations',
    'Human Rights',
    'Atrocity Crimes and International Justice',
    'Peace and Conflict',
    'Development and Global Disparities',
  ];
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Consulting', href: '/consulting' },
    { label: 'Blog', href: '/blog' },
  ];
  return (
    <footer className="bg-[#363F36] text-alt">
      {/* top section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-12">
        {/* brand & note */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* logo placeholder */}
            <Image src="/logo_footer.png" width={250} height={120} alt="A Global Classroom logo" />
          </div>
          <p className="max-w-xs text-sm text-alt leading-relaxed">
            A Global Classroom is an independent curriculum provider and is not endorsed by the
            International Baccalaureate (IB) Organization.
          </p>
        </div>

        {/* courses */}
        <div>
          <h4 className="mb-4 font-semibold text-alt">Courses</h4>
          <ul className="space-y-2 text-sm">
            {courses.map((c) => (
              <li key={c}>
                <Link href="#" className="hover:text-white transition-colors">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* navigation */}
        <div>
          <h4 className="mb-4 font-semibold text-alt">Navigation</h4>
          <ul className="space-y-2 text-sm">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* contact form */}
        <div>
          <h4 className="mb-4 font-semibold text-alt">Contact</h4>
          <form className="flex items-center max-w-xs border border-[#D9C7BF] rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Enter your Email address"
              className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-[#8E8E8E] text-[#FDFDFD] outline-none"
            />
            <button
              type="button"
              className="bg-[#D9C7BF] px-4 py-2 text-sm font-medium text-[#363F36] hover:bg-[#EFE9E9] transition-colors"
            >
              Send Email
            </button>
          </form>
        </div>
      </div>

      {/* bottom bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-6 gap-4">
        <p className="text-sm text-[#D9C7BF]">
          Copyright © 2025 Global Classroom
        </p>

        <div className="flex gap-6">
          {[
            { src: '/footer/instagram.png', alt: 'Instagram' },
            { src: '/footer/facebook.png', alt: 'Facebook' },
            { src: '/footer/icon.png', alt: 'icon' },
            { src: '/footer/pinterest.png', alt: 'Pinterest' },
          ].map(({ src, alt }) => (
            <Link key={alt} href="#" className="block">
              <Image src={src} width={24} height={24} alt={alt} className="hover:opacity-80 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
