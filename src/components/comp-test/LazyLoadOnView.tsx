// components/LazyLoadOnView.tsx
"use client";
import { useEffect, useRef, useState } from "react";

// Define components that will be loaded on demand
type DynamicComponentType = {
  comp1: React.ComponentType<object>;
  comp2: React.ComponentType<object>;
  comp3: React.ComponentType<object>;
  comp4: React.ComponentType<{ text: string }>;
};

type DynamicComponent = DynamicComponentType[keyof DynamicComponentType];

type Props = {
  component: keyof DynamicComponentType;
  height?: number;
  text?: string;
};

export default function LazyLoadOnView({
  component,
  height = 300,
  text,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [Component, setComponent] = useState<DynamicComponent | null>(null);

  // Set up intersection observer to detect when component enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // only load once
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Load the component only when it comes into view
  useEffect(() => {
    if (!inView) return;

    // Dynamic import based on the component name
    const loadComponent = async () => {
      try {
        let loadedComponent;

        switch (component) {
          case "comp1":
            loadedComponent = (await import("@/components/comp1")).default;
            break;
          case "comp2":
            loadedComponent = (await import("@/components/comp2")).default;
            break;
          case "comp3":
            loadedComponent = (await import("@/components/comp3")).default;
            break;
          case "comp4":
            loadedComponent = (await import("@/components/comp4")).default;
            break;
          default:
            console.error(`Unknown component: ${component}`);
            return;
        }

        setComponent(loadedComponent as DynamicComponent);
      } catch (error) {
        console.error(`Error loading component ${component}:`, error);
      }
    };

    loadComponent();
  }, [component, inView]);

  return (
    <div ref={ref} className="lazy-load-container">
      {!Component ? (
        <div
          style={{ height, backgroundColor: "#f0f0f0" }}
          className="flex items-center justify-center text-gray-500"
        >
          Loading...
        </div>
      ) : component === "comp4" ? (
        <Component text={text || "Default text"} />
      ) : (
        <Component text={text || "Default text"} />
      )}
    </div>
  );
}
