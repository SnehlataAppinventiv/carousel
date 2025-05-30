import LazyLoadOnView from "./LazyLoadOnView";

export default function CompTestPage() {
  return (
    <div>
      <LazyLoadOnView
        component="comp4"
        height={300}
        text="comp 4 with lazy loading"
      />
      <LazyLoadOnView component="comp1" height={400} />
      <LazyLoadOnView component="comp2" height={500} />
      <LazyLoadOnView component="comp3" height={300} />
      <LazyLoadOnView
        component="comp4"
        height={300}
        text="another comp 4 instance"
      />
    </div>
  );
}
