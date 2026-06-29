import Link from "next/link";

export default function SkipToContent() {
  return (
    <Link href="#main-content" className="skip-to-content">
      Skip to main content
    </Link>
  );
}
