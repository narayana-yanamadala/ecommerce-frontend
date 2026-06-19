import { Fragment, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import { Container } from "react-bootstrap";
import ShopList from "../components/ShopList";
import { useParams } from "react-router-dom";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import ProductReviews from "../components/ProductReviews/ProductReviews";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { useProduct, useProducts } from "../hooks/useProducts";

const Product = () => {
  const { id } = useParams();
  const { product: selectedProduct, loading } = useProduct(id);
  const { products } = useProducts();
  const [relatedProducts, setRelatedProducts] = useState([]);

  useWindowScrollToTop();

  useEffect(() => {
    if (selectedProduct) {
      setRelatedProducts(
        products.filter(
          (p) => p.category === selectedProduct.category && p.id !== selectedProduct.id
        )
      );
    }
  }, [selectedProduct, products]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontSize: "48px" }}>⏳</div>
        <h3 style={{ color: "#0f3460", marginTop: "16px" }}>Loading product...</h3>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontSize: "48px" }}>😕</div>
        <h3 style={{ color: "#0f3460", marginTop: "16px" }}>Product not found</h3>
      </div>
    );
  }

  return (
    <Fragment>
      <Banner title={selectedProduct?.productName} />
      <ProductDetails selectedProduct={selectedProduct} />
      <ProductReviews selectedProduct={selectedProduct} />
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <Container>
            <h3>You might also like</h3>
          </Container>
          <ShopList productItems={relatedProducts} />
        </section>
      )}
    </Fragment>
  );
};

export default Product;
