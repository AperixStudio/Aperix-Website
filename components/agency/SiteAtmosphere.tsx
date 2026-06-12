export default function SiteAtmosphere() {
  return (
    <div aria-hidden="true" className="site-atmosphere">
      <div className="site-atmosphere__gradient" />
      <div className="site-atmosphere__blobs">
        <div className="site-atmosphere__blob site-atmosphere__blob--coral" />
        <div className="site-atmosphere__blob site-atmosphere__blob--peach" />
        <div className="site-atmosphere__blob site-atmosphere__blob--sky" />
        <div className="site-atmosphere__blob site-atmosphere__blob--rose" />
      </div>
      <div className="site-atmosphere__frost" />
      <div className="site-atmosphere__sheen" />
    </div>
  );
}
