import React from "react";

const LoadingSpinner = ({
  size = "medium",
  message = "Cargando...",
  fullscreen = false,
  className = "",
  showDots = true,
}) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8", // ✅ Aumentado de h-6 w-6
    large: "h-12 w-12",
    xlarge: "h-16 w-16", // ✅ Aumentado de h-12 w-12
  };

  const containerClasses = fullscreen
    ? "fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50" // ✅ Mejor opacidad
    : "flex items-center justify-center p-8";

  const SpinnerSVG = ({ className }) => (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const LoadingDots = () => (
    <div className="flex space-x-1 ml-2">
      <div
        className="w-1 h-1 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-1 h-1 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-1 h-1 bg-current rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          {" "}
          {/* ✅ Aumentado margen */}
          <SpinnerSVG className={`${sizeClasses[size]} text-blue-600`} />
        </div>

        {message && (
          <div className="flex items-center justify-center">
            <p
              className={`
              ${fullscreen ? "text-xl font-semibold" : "text-base font-medium"} 
              text-gray-700
            `}
            >
              {message}
            </p>
            {showDots && <LoadingDots />}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
