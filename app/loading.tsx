import { DiamondLogo } from "@/components/DiamondLogo";

export default function Loading() {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <DiamondLogo size={64} animated={true} />
        <p>Loading...</p>
      </div>
    </div>
  );
}

