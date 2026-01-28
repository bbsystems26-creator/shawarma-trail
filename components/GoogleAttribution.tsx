"use client";

/**
 * Google Attribution component
 * Required when displaying business data sourced from Google Places API
 */
export function GoogleAttribution() {
  return (
    <div className="text-xs text-muted-foreground/70 flex items-center gap-1 justify-center py-2">
      <span>מידע עסקי מ-</span>
      <span className="font-medium">Google</span>
    </div>
  );
}

export function GoogleAttributionInline() {
  return (
    <span className="text-xs text-muted-foreground/60 mr-2">
      (מידע מ-Google)
    </span>
  );
}
