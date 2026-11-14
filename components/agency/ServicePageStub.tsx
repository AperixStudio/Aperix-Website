import "./ServicesIndex.css";

/** Placeholder for a service page whose copy is not written yet. */
export default function ServicePageStub({ title }: { title: string }) {
  return (
    <div className="services-index">
      <header className="services-index__intro">
        <div>
          <p className="services-index__eyebrow">Services</p>
          <h1 className="services-index__heading">{title}</h1>
        </div>
      </header>
    </div>
  );
}
