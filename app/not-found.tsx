import Link from "next/link";
import { DiamondLogo } from "@/components/DiamondLogo";

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-content">
        <DiamondLogo size={80} animated={true} />
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="error-actions">
          <Link href="/" className="btn primary large">Go to Dashboard</Link>
          <Link href="/home" className="btn secondary large">Go to Home</Link>
        </div>
      </div>
    </div>
  );
}

