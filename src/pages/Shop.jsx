import { Col, Container, Row } from "react-bootstrap";
import Select from "react-select";
import { Fragment, useState, useEffect } from "react";
import ShopList from "../components/ShopList";
import Banner from "../components/Banner/Banner";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import { useProducts, useCategories } from "../hooks/useProducts";

const customStyles = {
  control: (p) => ({ ...p, backgroundColor: "#0f3460", color: "white", borderRadius: "5px", border: "none", boxShadow: "none", minWidth: "200px", height: "40px" }),
  option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? "#0f3460" : "white", color: s.isSelected ? "white" : "#0f3460", "&:hover": { backgroundColor: "#0f3460", color: "white" } }),
  singleValue: (p) => ({ ...p, color: "white" }),
};

const Shop = () => {
  const { products, loading } = useProducts();
  const categories = useCategories();
  const [filterList, setFilterList] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  useWindowScrollToTop();

  useEffect(() => {
    setFilterList(products);
  }, [products]);

  const catOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const handleCategory = (opt) => {
    const filtered = opt.value
      ? products.filter((p) => p.category === opt.value)
      : products;
    setFilterList(filtered.filter((p) =>
      p.productName.toLowerCase().includes(searchWord.toLowerCase())
    ));
  };

  const handleSearch = (e) => {
    const word = e.target.value;
    setSearchWord(word);
    setFilterList(
      products.filter((p) =>
        p.productName.toLowerCase().includes(word.toLowerCase())
      )
    );
  };

  return (
    <Fragment>
      <Banner title="Shop All Products" />
      <section className="filter-bar">
        <Container className="filter-bar-contianer">
          <Row className="justify-content-center">
            <Col md={4}>
              <Select
                options={catOptions}
                defaultValue={{ value: "", label: "All Categories" }}
                styles={customStyles}
                onChange={handleCategory}
              />
            </Col>
            <Col md={8}>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={handleSearch}
                />
                <ion-icon name="search-outline"></ion-icon>
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <p style={{ color: "#888", fontSize: "16px" }}>⏳ Loading products...</p>
            </div>
          ) : (
            <ShopList productItems={filterList} />
          )}
        </Container>
      </section>
    </Fragment>
  );
};

export default Shop;
