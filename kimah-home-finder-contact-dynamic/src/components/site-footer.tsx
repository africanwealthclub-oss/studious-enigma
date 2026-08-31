import { Link } from "@tanstack/react-router";
import { Instagram, Phone, Mail, LinkIcon } from "lucide-react";
import logo from "@/assets/logo-light.png";

export function SiteFooter() {
  return (
    <footer className="surface-ink mt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <img
            src={logo}
            alt="Kimah The Realtor"
            className="h-20 w-20 object-contain"
            loading="lazy"
          />

          <p className="mt-5 max-w-xs text-sm leading-relaxed opacity-70">
            Tiffany Durojaiye Texas Realtor serving the Dallas Fort Worth
            metroplex and surrounding communities.
          </p>
        </div>

        <div>
          <h3 className="eyebrow">Explore</h3>

          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/listings">Listings</Link>
            </li>
            <li>
              <Link to="/testimonials">Testimonials</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="eyebrow">Connect</h3>

          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li className="flex items-center gap-2">
              <Phone className="size-4" />
              <a href="tel:+13476919080">+1 (347) 691-9080</a>
            </li>

            <li className="flex items-center gap-2">
              <Mail className="size-4" />
              <a href="mailto:hello@kimahtherealtor.com">
                hello@kimahtherealtor.com
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Instagram className="size-4" />
              <a
                href="https://www.instagram.com/kimahtherealtor"
                target="_blank"
                rel="noreferrer"
              >
                @kimahtherealtor
              </a>
            </li>

            <li className="flex items-center gap-2">
              <LinkIcon className="size-4" />
              <a
                href="https://linktr.ee/Touringwithmariam"
                target="_blank"
                rel="noreferrer"
              >
                All links
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6 text-center text-xs tracking-widest uppercase opacity-50">
        © {new Date().getFullYear()} Kimah The Realtor · Licensed Texas
        Realtor
      </div>
    </footer>
  );
}
