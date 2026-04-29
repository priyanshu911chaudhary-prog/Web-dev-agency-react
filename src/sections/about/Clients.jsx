import atlassian from '../../assets/images/brand-logo/atlassian_2024-logo_brandlogos.net_lqsq6.png';
import cursor from '../../assets/images/brand-logo/cursor_code_editor-logo_brandlogos.net_rt3vi.png';
import paypal from '../../assets/images/brand-logo/paypal_2014-logo_brandlogos.net_r9meu.png';
import honda from '../../assets/images/brand-logo/honda-logo_brandlogos.net_xhjei.png';
import googlePhotos from '../../assets/images/brand-logo/google_photos_2025-logo_brandlogos.net_lxwt7.png';
import leetcode from '../../assets/images/brand-logo/leetcode-logo_brandlogos.net_c4kgx.png';
import linkedin from '../../assets/images/brand-logo/linkedin-logo.png';
import arcfox from '../../assets/images/brand-logo/arcfox-logo_brandlogos.net_zhtz5.png';
import replit from '../../assets/images/brand-logo/replit-logo_brandlogos.net_afdxm.png';
import youtube from '../../assets/images/brand-logo/youtube_2017-2024-logo_brandlogos.net_2nnlz.png';
import nike from '../../assets/images/brand-logo/nike_just_do_it-logo_brandlogos.net_wp96x.png';
import facebook from '../../assets/images/brand-logo/facebook_2019-2023-logo_brandlogos.net_wgusz.png';

// Row 1 — logos 1 to 6
const row1Logos = [
  { id: 1, src: atlassian, alt: "Client 01", className: "h-12 md:h-16" },
  { id: 2, src: cursor, alt: "Client 02", className: "h-12 md:h-16" },
  { id: 3, src: paypal, alt: "Client 03", className: "h-12 md:h-16" },
  { id: 4, src: honda, alt: "Client 04", className: "h-12 md:h-16" },
  { id: 5, src: googlePhotos, alt: "Client 05", className: "h-12 md:h-16" },
  { id: 6, src: leetcode, alt: "Client 06", className: "h-12 md:h-16" },
];

// Row 2 — logos 7 to 12
const row2Logos = [
  { id: 7, src: linkedin, alt: "Client 07", className: "h-12 md:h-16" },
  { id: 8, src: arcfox, alt: "Client 08", className: "h-12 md:h-16" },
  { id: 9, src: replit, alt: "Client 09", className: "h-12 md:h-16" },
  { id: 10, src: youtube, alt: "Client 10", className: "h-12 md:h-16" },
  { id: 11, src: nike, alt: "Client 11", className: "h-11 md:h-15" },
  { id: 12, src: facebook, alt: "Client 12", className: "h-12 md:h-16" },
];

const Clients = () => {
  const renderLogo = (logo) => (
    <div key={logo.id} className="flex-shrink-0 flex items-center justify-center">
      {logo.src ? (
        <img
          src={logo.src}
          alt={logo.alt}
          className={`${logo.className || "h-10 md:h-12"} w-auto object-contain filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300`}
        />
      ) : (
        <div className="w-28 h-10 bg-[#0D0D0D]/[0.06] rounded-sm flex items-center justify-center text-[10px] uppercase tracking-widest text-[#0D0D0D]/25">
          {logo.alt}
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-transparent pt-0 pb-10 overflow-hidden w-full my-12">
      <h2 className="font-sans text-[11px] md:text-[1.1rem] uppercase tracking-widest text-[#555] mx-14 px-6 mb-12 font-bold" style={{ fontFamily: "Major Mono Display, sans-serif" }}>
        Trusted by great brands
      </h2>

      {/* Row 1 */}
      <div className="flex w-max animate-marquee mb-4 gap-16">
        {row1Logos.map(renderLogo)}
        {row1Logos.map((logo) => renderLogo({ ...logo, id: `${logo.id}-dup` }))}
      </div>

      {/* Row 2 */}
      <div className="flex w-max animate-marquee-slow gap-16">
        {row2Logos.map(renderLogo)}
        {row2Logos.map((logo) => renderLogo({ ...logo, id: `${logo.id}-dup` }))}
      </div>
    </section>
  );
};

export default Clients;
