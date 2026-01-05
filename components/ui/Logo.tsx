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
  variant?: "default" | "gradient-bg" | "no-bg";
}

export function Logo({
  href = "/",
  className = "",
  imageClassName = "",
  showText = false,
  text = "",
  width = 120,
  height = 40,
  variant = "no-bg",
}: LogoProps) {
  // Background styles based on variant
  const bgStyles = {
    "default": "p-3 rounded-xl bg-gradient-fizmo shadow-lg shadow-fizmo-purple-500/30",
    "gradient-bg": "p-3 rounded-xl glassmorphic border border-fizmo-purple-500/30",
    "no-bg": "",
  };

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${bgStyles[variant]} inline-flex items-center justify-center transition-all hover:scale-105`}>
        <Image
          src="/assets/FIZMO LOGO.svg"
          alt="Fizmo Logo"
          width={width}
          height={height}
          className={`object-contain ${imageClassName}`}
          style={{ mixBlendMode: 'normal' }}
          priority
        />
      </div>
      {showText && text && (
        <span className="text-xl font-bold gradient-text">{text}</span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group">
        {content}
      </Link>
    );
  }

  return content;
}
