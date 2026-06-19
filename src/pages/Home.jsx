import { Fragment } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Section from "../components/Section";
import SliderHome from "../components/Slider";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { useProducts } from "../hooks/useProducts";

const Home = () => {
  const { products, loading } = useProducts();

  const mobiles   = products.filter((p) => p.category === "mobile");
  const furniture = products.filter((p) => p.category === "sofa" || p.category === "chair");
  const watches   = products.filter((p) => p.category === "watch");
  const wireless  = products.filter((p) => p.category === "wireless");

  useWindowScrollToTop();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontSize: "48px" }}>🛒</div>
        <h3 style={{ color: "#0f3460", marginTop: "16px" }}>Loading products...</h3>
        <p style={{ color: "#888" }}>Fetching latest products from server</p>
      </div>
    );
  }

  return (
    <Fragment>
      <SliderHome />
      <Wrapper />
      {mobiles.length > 0   && <Section title="New Arrivals"     bgColor="#f6f9fc" productItems={mobiles} />}
      {furniture.length > 0 && <Section title="Best Sales"       bgColor="white"   productItems={furniture} />}
      {wireless.length > 0  && <Section title="Wireless & Audio" bgColor="#f6f9fc" productItems={wireless} />}
      {watches.length > 0   && <Section title="Premium Watches"  bgColor="white"   productItems={watches} />}
    </Fragment>
  );
};

export default Home;
