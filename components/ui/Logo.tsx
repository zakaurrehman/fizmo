import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  showText?: boolean;
  text?: string;
  width?: number;
  height?: number;
}

export function Logo({
  href = "/",
  className = "",
  imageClassName = "",
  showText = false,
  text = "",
  width = 120,
  height = 40,
}: LogoProps) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/assets/FIZMO LOGO.svg"
        alt="Fizmo Logo"
        width={width}
        height={height}
        className={`hover:scale-105 transition-transform ${imageClassName}`}
        priority
      />
      {showText && text && (
        <span className="text-xl font-bold gradient-text">{text}</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
