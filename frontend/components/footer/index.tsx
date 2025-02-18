import Logo from "@/components/logo";
import clsx from "clsx";
import Link from "next/link";
import Tiktok from "@/components/footer/tiktok";
import Instagram from "./instagram";
import Linkedin from "./linkedin";
import Facebook from "./facebook";

const Footer = () => {
  return (
    <div
      className={clsx(
        "flex flex-col border-t-[3px]",
        "sm:flex-row sm:justify-between",
        "md:flex-row",
        "lg:flex-row",
      )}
    >
      <div
        className={clsx(
          "left",
          "flex flex-col items-center",
          "sm:flex-row",
          "md:flex-row",
          "lg:flex-row",
        )}
      >
        <Link href="/" className="justify-self-center">
          <Logo />
        </Link>
        <p className={clsx("pl-5")}>
          <span className="copyright">© FC International Ltd. 2025</span>
        </p>
      </div>

      <div
        className={clsx(
          "bottom",
          "flex flex-col items-center",
          "sm:flex-row",
          "md:flex-row",
          "lg:flex-row",
        )}
      >
        <div>
          <ul
            className={clsx(
              "flex flex-row items-center justify-center [&_svg]:mx-2 [&_svg]:fill-[#74767E]",
              "sm:flex-row sm:[&_svg]:mx-1 sm:[&_svg]:h-[25px] sm:[&_svg]:w-[25px]",
              "md:flex-row",
              "lg:flex-row",
            )}
          >
            <li>
              <Link href="#">
                <Tiktok />
              </Link>
            </li>

            <li>
              <Link href="#">
                <Instagram />
              </Link>
            </li>

            <li>
              <Link href="#">
                <Linkedin />
              </Link>
            </li>

            <li>
              <Link href="#">
                <Facebook />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
